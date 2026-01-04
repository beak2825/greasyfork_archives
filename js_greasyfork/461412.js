// ==UserScript==
// @name         Assault
// @namespace    Assault.the.tert
// @version      1.1.1
// @description  Assault a tert very fast
// @author       Heasley
// @match        https://www.torn.com/city.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/461412/Assault.user.js
// @updateURL https://update.greasyfork.org/scripts/461412/Assault.meta.js
// ==/UserScript==
var lastTert = localStorage.getItem('theTert') || '';

GM_addStyle(`
  .theButton {
     width: 100px;
     height: 40px;
     border-radius: 10px;
     margin-right: 10px;
     cursor: pointer;
  }
  .theButton:not([disabled]):active {
  transform: translateY(2px);
  }
  .theRed {
     color: red;
  }
  .theGreen {
     color: green;
  }

  .tertBox {
    height: 24px;
    width: 30px;
    border-radius: 5px;
    padding: 3px;
    padding-left: 5px;
    margin-right: 5px;
    text-align: center;
  }

  #theError {
    margin-left: 10px;
  }

  #theTertDiv {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  #enableBoxes {
    display: flex;
    flex-direction: column;
    margin-left: auto;
  }

  #enableBoxes > span {
    display: flex;
    align-items: center;
  }

  #enableBoxes > span > label {
    padding-left: 3px;
  }


  .wb_torn_button, .d .content-title .wb_torn_button {
    background: transparent linear-gradient(180deg ,#CCCCCC 0%,#999999 60%,#666666 100%) 0 0 no-repeat;
    border-radius: 5px;
    font-family: Arial,sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0;
    color: #333;
    text-shadow: 0 1px 0 #ffffff66;
    text-decoration: none;
    text-transform: uppercase;
    border: none;
    outline: none;
    overflow: visible;
    box-sizing: border-box;
    line-height: 16px;
    padding: 4px 8px;
    white-space: nowrap;
    cursor: pointer;
}

.wb_torn_button:hover, .wb_torn_button:focus, .d .content-title .wb_torn_button:hover, .d .content-title .wb_torn_button:focus {
    background: transparent linear-gradient(180deg,#E5E5E5 0%,#BBBBBB 60%,#999999 100%) 0 0 no-repeat;
    color: #333
}

.wb_torn_button:active, .d .content-title .wb_torn_button:active {
    background: transparent linear-gradient(180deg,#b7b7b7 0%,#969696 60%,#7a7a7a 100%) 0 0 no-repeat;
    color: #333
}

.wb_torn_button.disabled,.wb_torn_button:disabled,.wb_torn_button:hover.disabled,.wb_torn_button:hover:disabled  {
    color: #777;
    box-shadow: 0 1px 0 #ffffffa6;
    text-shadow: 0 -1px 0 #ffffff66;
    background: transparent linear-gradient(180deg,#999999 0%,#CCCCCC 100%) 0 0 no-repeat;
    cursor: default
}

.d .content-title .wb_torn_button.disabled,.d .content-title .wb_torn_button:disabled,.d .content-title .wb_torn_button:hover.disabled,.d .content-title .wb_torn_button:hover:disabled  {
    color: #777;
    box-shadow: 0 1px 0 #ffffffa6;
    text-shadow: 0 -1px 0 #ffffff66;
    background: transparent linear-gradient(180deg,#999999 0%,#CCCCCC 100%) 0 0 no-repeat;
    cursor: default
}

  `);
(function() {
    'use strict';

    const tertObserver = new MutationObserver(function(mutations) {
        if (document.contains(document.querySelector('div.territory-dialogue-wrap'))) {
            if ($('div.territory-dialogue-wrap.progress-bar').length) {
                $('div.territory-dialogue-wrap.progress-bar').each(function( index ) {
                    if ($(this).find('div.title.assaulter > a:contains("Loading...")').length <= 0) {
                        if ($('#theID').length == 0) modifyLeaflet();
                    }
                });

            } else {
                if ($('#theID').length == 0) modifyLeaflet();

            }
        }
    });
    tertObserver.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

    var tertDiv = document.createElement("div");
    tertDiv.id = "theTertDiv";


    var tertBox = document.createElement("input");
    tertBox.setAttribute("type", "text");
    tertBox.setAttribute("id", "theTertBox");
    tertBox.value = lastTert;
    tertBox.classList.add("tertBox");

    var claim = document.createElement("button");
    claim.innerHTML = "Claim";
    claim.classList.add("theButton");
    claim.classList.add("wb_torn_button");
    claim.disabled = true;

    var assault = document.createElement("button");
    assault.innerHTML = "Assault";
    assault.classList.add("theButton");
    assault.classList.add("wb_torn_button");
    assault.disabled = true;


    var abandon = document.createElement("button");
    abandon.innerHTML = "Abandon";
    abandon.classList.add("theButton");
    abandon.classList.add("wb_torn_button");
    abandon.disabled = true;


    var errorText = document.createElement("p");
    errorText.setAttribute("id", "theError");
    errorText.innerHTML = "&nbsp;";


    var enableBoxes = document.createElement("div");
    enableBoxes.id = "enableBoxes";

    var claimSpan = document.createElement("span");
    var claimCheck = document.createElement("input");
    claimCheck.type = "checkbox";
    claimCheck.id = "claimCheck";
    var claimLabel = document.createElement('label')
    claimLabel.htmlFor = "claimCheck";
    claimLabel.appendChild(document.createTextNode('Enable claim'));
    claimSpan.appendChild(claimCheck);
    claimSpan.appendChild(claimLabel);


    var assaultSpan = document.createElement("span");
    var assaultCheck = document.createElement("input");
    assaultCheck.type = "checkbox";
    assaultCheck.id = "assaultCheck";
    var assaultLabel = document.createElement('label')
    assaultLabel.htmlFor = "assaultCheck";
    assaultLabel.appendChild(document.createTextNode('Enable assault'));
    assaultSpan.appendChild(assaultCheck);
    assaultSpan.appendChild(assaultLabel);


    var abandonSpan = document.createElement("span");
    var abandonCheck = document.createElement("input");
    abandonCheck.type = "checkbox";
    abandonCheck.id = "abandonCheck";
    var abandonLabel = document.createElement('label')
    abandonLabel.htmlFor = "abandonCheck";
    abandonLabel.appendChild(document.createTextNode('Enable abandon'));
    abandonSpan.appendChild(abandonCheck);
    abandonSpan.appendChild(abandonLabel);


    enableBoxes.appendChild(assaultSpan);
    enableBoxes.appendChild(abandonSpan);
    enableBoxes.appendChild(claimSpan);


    tertDiv.appendChild(assault);
    tertDiv.appendChild(abandon);
    tertDiv.appendChild(claim);
    tertDiv.appendChild(tertBox);
    tertDiv.appendChild(enableBoxes);


    var appendEl = document.getElementsByClassName("content-title")[0];
    appendEl.appendChild(tertDiv);
    appendEl.appendChild(errorText);


    claim.addEventListener ("click", function() {
        const id = document.getElementById("theTertBox").value;
        territory("claim", id);
    });
    abandon.addEventListener ("click", function() {
        const id = document.getElementById("theTertBox").value;
        territory("abandon", id);
    });
    assault.addEventListener ("click", function() {
        const id = document.getElementById("theTertBox").value;
        territory("take", id);
    });


    claimCheck.addEventListener("change", function() {
        const enabled = claimCheck.checked;
        claim.disabled = !enabled;
    });
    abandonCheck.addEventListener("change", function() {
        const enabled = abandonCheck.checked;
        abandon.disabled = !enabled;
    });
    assaultCheck.addEventListener("change", function() {
        const enabled = assaultCheck.checked;
        assault.disabled = !enabled;
    });

    tertBox.addEventListener("change", function() {
        const v = this.value;
        localStorage.setItem('theTert', v);
    });


    document.addEventListener("click", function(e){
        const target = e.target.closest(".theDBID");
        if(target){
            const dbID = $(target).attr('data-dbid');
            if (dbID) {
                $(tertBox).val(dbID);
                localStorage.setItem('theTert', dbID);
            }
        }
    });
})();

function territory(type, id) {
    const errorEl = document.getElementById("theError");
    if (!id) {
        if (errorEl) errorEl.innerHTML = "Script Error: You must enter a territory Database ID.";
        return;
    }

    const theURL = "https://www.torn.com/city.php";
    const theData = "type="+type+"&id="+id+"&exist=&exist_data=&is_old_collection=0&step=action";

    $.ajax({
        type: "POST",
        url: theURL,
        data: theData,
        dataType: 'json',
        success: function(data) {
            if (data) {
                const timestamp = new Date().toISOString();
                if (data.error) {
                    console.log(`[Assault Script][${timestamp}][TerrID=${id}] ${data.error}`, data);

                    if (errorEl) {
                        errorEl.classList.remove("theGreen");
                        errorEl.classList.add("theRed");
                        errorEl.innerHTML = data.error;
                    }
                }

                if (data.success) {
                    console.log(`[Assault Script][${timestamp}][TerrID=${id}] Successfully performed ${type} on territory`, data);


                    errorEl.classList.remove("theRed");
                    errorEl.classList.add("theGreen");
                    errorEl.innerHTML = "The Tert was successfully "+ type + "ed :)";
                }
            }
        }
    });
}


function modifyLeaflet() {
    if ($('#theID').length != 0) return;

    const dbID = $('path.territory.selected').attr("db_id");
    if (dbID) {
        $('ul.territory-info-wrap').prepend('<li><span class="bold">Database ID: </span><a class="theDBID" data-dbid='+dbID+'>'+dbID+'</a></li>');
    }

    let terr_wrap = $('div.territory-dialogue-wrap');
    terr_wrap.attr('id', 'theID');
    let terr = $( "ul.territory-info-wrap" ).find("li > span.bold:contains('Name:')");
    terr.each(function() {
        let terrName = $(this).parent().text().split("Name:").join("");
        terrName = $.trim(terrName);
        $(this).parent().html("<span class='bold'>Name: </span><a href='https://www.torn.com/city.php#terrName=" + terrName + "'>" + terrName + "</a>");
    });
}