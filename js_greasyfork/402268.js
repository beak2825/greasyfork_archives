// ==UserScript==
// @name         Faction Territories
// @namespace    Heasleys.factionterritories
// @version      1.0.3
// @description  Search map for factions or territories and add to favorites
// @author       Heasleys4hemp [1468764]
// @match        *.torn.com/city.php*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/402268/Faction%20Territories.user.js
// @updateURL https://update.greasyfork.org/scripts/402268/Faction%20Territories.meta.js
// ==/UserScript==

var APIKEY = localStorage.getItem('wb_apikey') || '';
var favoriteslist = JSON.parse(localStorage.getItem('wb_fav_factionlist')) || {};
var factionlist;
var f_to_terr_list = {};

GM_addStyle(`
.wb_container {
display: flex;
flex-direction: column;
}

div.wb_head {
border-bottom: none;
border-radius: 5px 5px 5px 5px;
box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px;
padding: 6px 10px;
background-color: rgb(202, 185, 0);
background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px);
background-size: 4px;
cursor: pointer;
}

div.wb_head.expanded {
border-bottom: none;
border-radius: 5px 5px 0px 0px;
}

span.wb_title {
color: #ffffff;
font-size: 13px;
letter-spacing: 1px;
text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
font-weight: 700;
line-height: 16px;
}

span.wb_error {
color: #bf532e;
text-shadow: none;
font-weight: 800;
}

span.wb_success {
color: #478807;
text-shadow: none;
font-weight: 800;
}

.wb_content {
background-color: #F2F2F2;
border: 1px solid rgba(0, 0, 0, .5);
border-radius: 0px 0px 5px 5px;
border-top: none;
}

.wb_row {
display: flex;
margin: 0.75em;
justify-content: space-between;
}

.wb_col {
margin-left: 20px;
margin-right: 20px;
}

.wb_col > p {
font-weight: bold;
font-size: 16px;
border-bottom: 1px solid #363636;
margin-bottom: 3px;
padding-bottom: 2px;
}

.wb_col input {
vertical-align: middle;
}

.checkboxes span {
vertical-align: middle;
}

.wb_col ul>li {
display: block;
padding-right: 10px;
padding-left: 22px;
text-indent: -22px;
padding-bottom: 3px;
}

.wb_hide {
cursor: pointer;
}

span.wb_icon {
align-items: center;
justify-content: center;
width: 16px;
float: right;
}

span.wb_icon svg {
display: block;
height: 16px;
fill: white;
cursor: pointer;
margin-left: auto;
margin-right: auto;
}

.wb_input {
width: 118px;
height: 23px;
border-radius: 5px;
border: 1px solid rgba(0, 0, 0, .5);
padding: 0 4px 0 10px;
}

.wb_input.wb_input_group {
border-radius: 5px 0px 0px 5px !important;
width: 84px;
}

.wb_input_button {
height: 25px;
border-radius: 5px;
background-color: #f2f2f2;
border: 1px solid rgba(0, 0, 0, .5);
}

.wb_fav_button {
background-position: -8px -42px !important;
width: 18px !important;
height: 18px !important;
}

.wb_fav_button:hover {
background-position: -42px -42px !important;
}

.wb_fav_button_faved {
background-position: -42px -8px !important;
}

.wb_fav_button_faved:hover {
background-position: -8px -8px !important;
}

.wb_input_button:hover {
background-color: #fafafa;
}

.wb_input_button:active {
background-color: #d9d9d9;
}

.wb_input_button.wb_input_group {
border-radius: 0px 5px 5px 0px;
vertical-align: middle;
margin-left: -5px;
}
`);



$(window).load(function(){

    $( document ).ajaxComplete(function(event, jqXHR, ajaxObj) {

        if (ajaxObj.url && ajaxObj.url.includes('step=mapData')) {
            createWBHeader();
            const mapdata = JSON.parse(jqXHR.responseText);

            factionlist = mapdata.factionOwnTerritories.factionData;

            $('#wb_apikey_input').val(APIKEY);
            getAPI();
        }

    });

    var observer = new MutationObserver(function(mutations) {
        if (document.contains(document.querySelector('div.territory-dialogue-wrap'))) {
            if ($('div.territory-dialogue-wrap.progress-bar').length) {
                $('div.territory-dialogue-wrap.progress-bar').each(function( index ) {
                    if ($(this).find('div.title.assaulter > a:contains("Loading...")').length <= 0) {
                        if ($('#wb_mod').length > 0) {} else{
                            modifyLeaflet();
                        }
                    }
                });

            } else {
                if ($('#wb_mod').length > 0) {} else{
                    modifyLeaflet();
                }
            }
        }
    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

});//window.load


function getAPI() {
    if (APIKEY != "" && APIKEY.length == 16) {
        let flist = JSON.parse(JSON.stringify(factionlist));
        let favlist = JSON.parse(JSON.stringify(favoriteslist));


        var request_url = 'https://api.torn.com/torn/?selections=territory&key='+APIKEY;

        $.ajax({
            url: request_url,
            type: "GET",
            processData: false,
            dataType: 'json',
            success: function(data) {
                if (data.error) {
                    $(".wb_error").text(" - API error code " + data.error.code + " - " + data.error.error);
                    $(".wb_error").prop('hidden', false);
                } else {
                    $(".wb_error").prop('hidden', true);
                    var list = "";
                    var favslist = '<option selected></option>';
                    if (flist != null) {
                        $("#flist").empty();
                        $("#favlist").empty();

                        $.when( $.each(data.territory, function(index, element) {

                            $.each(flist, function(n,e) {

                                if (element.faction == e.factionID) {
                                    f_to_terr_list[e.factionID] = {
                                        'terr' : index,
                                        'name' : e.name,
                                        'image' : e.image,
                                        'memberAmount' : e.memberAmount,
                                        'factionID' : e.factionID
                                    };
                                    list += '<option value="'+e.factionID+'" data-name="'+e.name+'" data-terr="'+index+'" data-image="'+e.image+'" data-members="'+e.memberAmount+'">'+e.name+'</option>';
                                    delete flist[n];

                                    $.each(favoriteslist, function(ind,ele) {
                                        if (element.faction == ind) {
                                            favslist += '<option value="'+e.factionID+'" data-name="'+e.name+'" data-terr="'+index+'" data-image="'+e.image+'" data-members="'+e.memberAmount+'">'+e.name+'</option>';
                                            delete favlist[n];
                                            return false;
                                        }
                                    });

                                    return false;
                                }

                            });//each

                        })//each

                              ).then(function() {
                            $("#favlist").append(favslist);
                            $("#flist").append(list);
                            $(".wb_success").fadeToggle(100).delay(3000).fadeToggle(1000);

                        });//then
                    }//if flist != null
                }//else error

            }//success
        });


    } else {
        $(".wb_error").text(" - You must enter a valid API key to use faction search and favorites");
        $(".wb_error").prop('hidden', false);
    }
}//end function

function modifyLeaflet() {
    //always modify
    let terr_wrap = $('div.territory-dialogue-wrap');
    terr_wrap.attr('id', 'wb_mod');
    let terr = $( "ul.territory-info-wrap" ).find("li > span.bold:contains('Name:')");
    terr.each(function() {
        let terrName = $(this).parent().text().split("Name:").join("");
        terrName = $.trim(terrName);
        $(this).parent().html("<span class='bold'>Name: </span><a href='https://www.torn.com/city.php#terrName=" + terrName + "'>" + terrName + "</a>");
    });

    if ($('div.territory-dialogue-wrap > div.title:contains("Unclaimed Territory")').length > 0 || $('div.territory-dialogue-wrap > div.title.defender').length > 0){
        //do not modify further if unclaimed or in war
    }else {
        //add fav button for leaflet

        let a = terr_wrap.find('div.title > a.text-blue.c-pointer');
        let href = a.attr('href');
        let fname = a.text();
        let fid = href.split("=").pop();
        fid = fid.toString();

        $('ul.territory-info-wrap').append('<li><span class="bold">Toggle favorite:</span><button class="option-equip wai-btn wb_fav_button" id="favbutton"></button></li>');

        $.each(favoriteslist, function(ind, ele) {
            if (fid == ind) {
                $('#favbutton').addClass("wb_fav_button_faved");
                return false;
            }
        });


        $('#favbutton').click(function() {
            if (favoriteslist[fid]) {
                delete favoriteslist[fid];
            }else{
                favoriteslist[fid] = fname;
            }
            $(this).toggleClass("wb_fav_button_faved");
            recreateFavList();
            localStorage.setItem("wb_fav_factionlist", JSON.stringify(favoriteslist));
        });

    }//else unclaimed/war
}

function recreateFavList() {
    let favoritelist = JSON.parse(JSON.stringify(favoriteslist));
    let favstring = '<option selected></option>';
    $("#favlist").empty();

    $.when( $.each(f_to_terr_list, function(i,e) {

        $.each(favoritelist, function(ind, ele) {
            if (i == ind) {
                favstring += '<option value="'+e.factionID+'" data-name="'+e.name+'" data-terr="'+e.terr+'" data-image="'+e.image+'" data-members="'+e.memberAmount+'">'+e.name+'</option>';
            }
        });
    })
          ).then(function() {
        $("#favlist").append(favstring);
    });
}

function createWBHeader() {

    document.querySelector('#tab-menu').insertAdjacentHTML('beforebegin', `
<div class="wb_container">
<div class="wb_head"><span class="wb_title">Faction Territories</span><span class="wb_error" hidden></span><span class="wb_success" hidden> - Factions loaded</span><span class="wb_toggle wb_icon" id="wb_svg_right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon" id="wb_svg_down" hidden><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span></div>
<div class="wb_content" hidden>
<div class="wb_row">
<div class="wb_col">
<p>Faction Search</p>
<input class="wb_input" list="flist" id="flistinput">
<datalist id="flist">

</datalist>
</div>

<div class="wb_col">
<p>Territory Search</p>
<input class="wb_input wb_input_group" type="text" id="wb_terr_input" required maxlength="3">
<button class="wb_input_button wb_input_group" type="button" id="wb_terr_button">Search</button>
</div>

<div class="wb_col">
<p>Favorites</p>
<select class="wb_input" id="favlist"></select>
</div>

<div class="wb_col">
<p class="wb_hide" data-target="#api_input">API Key ▼</p>
<div id="api_input" hidden>
<input class="wb_input wb_input_group" type="text" id="wb_apikey_input" required minlength="16" maxlength="16">
<button class="wb_input_button wb_input_group" type="button" id="wb_save_apikey">Save</button>
</div>
</div>


</div>
</div>
</div>
<hr class="delimiter-999 m-top10">
`);

    $(".wb_hide").click(function() {
        let target = $(this).data('target');
        $(target).slideToggle("slow");
    });

    $(".wb_head").click(function() {
        $(this).toggleClass("expanded");
        $(".wb_content").slideToggle("slow");

        if (!$("#wb_svg_right").is(':visible')) {
            $("#wb_svg_right").attr("hidden",false);
            $("#wb_svg_down").attr("hidden",true);
        } else {
            $("#wb_svg_right").attr("hidden",true);
            $("#wb_svg_down").attr("hidden",false);
        }
    });

    $('#wb_save_apikey').click(function() {
        $(".wb_error").prop('hidden', true);
        APIKEY = $('#wb_apikey_input').val();
        localStorage.setItem('wb_apikey', APIKEY);
        getAPI();
    });

    $('#flistinput').change(function(){
        let id = $(this).val();
        if (id != "") {
            let name = $('#flist [value="' + id + '"]').data('name');
            let terr = $('#flist [value="' + id + '"]').data('terr');
            window.location = "#terrName=" + terr;
        }
    });

    $('#favlist').change(function(){
        let id = $(this).val();
        if (id != "") {
            let name = $('#favlist [value="' + id + '"]').data('name');
            let terr = $('#favlist [value="' + id + '"]').data('terr');
            window.location = "#terrName=" + terr;
        }
    });

    $("#wb_terr_input").keyup(function(e){
        var code = e.key;
        if(code==="Enter") {
            let terr = $(this).val();
            if (terr != "") {
                window.location = "#terrName=" + terr.toUpperCase();
            }
        }
    });

    $('#wb_terr_button').click(function() {
        let terr = $('#wb_terr_input').val();
        if (terr != "") {
            window.location = "#terrName=" + terr.toUpperCase();
        }
    });

    $('input').focus(function() {
        $(this).select();
    });

    $('input').click(function() {
        $(this).select();
    });
}
