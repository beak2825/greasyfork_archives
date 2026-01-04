// ==UserScript==
// @name        TornBender
// @namespace    tornbender.zero.torn
// @version      0.4
// @description  map info
// @author       -zero [2669774]
// @match        https://www.torn.com/city.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      torndown.onrender.com
// @grant        GM.xmlHttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472927/TornBender.user.js
// @updateURL https://update.greasyfork.org/scripts/472927/TornBender.meta.js
// ==/UserScript==


let data;

GM_addStyle(`
.bender-torn {
position: absolute;
left: 50%;
top: 50%;
background-color: black;
opacity:90%;
border-radius: 10%;
transform: translate(-50%,-50%);

 max-height: 400px;
 padding:20px;
 font-size:15px;

}

.bender-torn > ul{
max-height: 300px;
overflow-y:scroll;
}

.bender-torn > ul::-webkit-scrollbar {
display:none;
}

`
           );



function getName(){
    if ($('.territory-info-wrap > li').length == 0){
        $("#terr-response").html("No territory Selected!");
        return;
    }

    let name = $('.territory-info-wrap').text().split("\n")[3].trim(" ");
    return name;

}

async function loadData(){
    //   data = await $.getJSON("https://torndown.onrender.com/warList.json");

    GM.xmlHttpRequest({
        method: 'GET',
        url: `https://torndown.onrender.com/warList.json`,
        headers: {
            'Content-Type': 'application/json'
        },
        onload: (response) => {
            try {
                let responseJ = JSON.parse(response.responseText);
                data = responseJ;
                console.log(data);
            } catch (err) {
                console.log("Bender: "+err);
            }
        },
        onerror: (err) => {
            reject(err);
        }
    });
}

function show(d){
    //$("#terr-response").html(JSON.stringify(d));
    let box = `<div class="bender-torn" id="bendermap"><ul>`;
    for (let df of d){
        box += `<li>${df}</li>`;
    }
    box += `</ul><input class="torn-btn" style="width:100%;" type="submit" id="hidebender" value="OK"></div>`;

    $('#map').append(box);
    const scrollableDiv = document.getElementById('bendermap');
    scrollableDiv.addEventListener('wheel', (event) => {
        event.stopPropagation();
    });

    scrollableDiv.addEventListener('touchstart', (event) => {
        // Prevent the touch event from propagating to the map
        event.stopPropagation();
    });

    scrollableDiv.addEventListener('touchmove', (event) => {
        // Allow touchmove events to propagate within the scrollableDiv
        // This will let the content inside the scrollableDiv scroll
    });

    $("#hidebender").on("click", function(){
        $(".bender-torn").remove();
    })

}

function insert(){
    if ($(".content-title").length == 0){
        setTimeout(insert, 500);
        return;
    }
    let elements = `<input type="submit" id="getTert" class="torn-btn"><span id="terr-response"></span>`;
    $(".content-title").append(elements);
    $("#getTert").on("click", function(){
        getData();
    });
}

function getData(){
    let name = getName();
    if (name){
        if (data[name]){
            show(data[name]);

        }
        else{
            $("#terr-response").html("Territory Not Found!");
        }

    }
}

$(document).mouseup(function(e)
                    {
    var container = $(".bender-torn");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        container.hide();
    }
});

async function main(){
    await loadData();
    insert();
}
main();