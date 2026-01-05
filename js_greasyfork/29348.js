// ==UserScript==
// @name        KAT [katcr.co] - Default values for Uploads
// @namespace   NotNeo
// @description Lets you set up defaults in the upload section of KAT (custom default description for every category)
// @include     http*://katcr.co/upload-form/user/*
// @include     http*://katcr.co/edit-form/user/*/torrent/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require  	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @version     1.4
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/29348/KAT%20%5Bkatcrco%5D%20-%20Default%20values%20for%20Uploads.user.js
// @updateURL https://update.greasyfork.org/scripts/29348/KAT%20%5Bkatcrco%5D%20-%20Default%20values%20for%20Uploads.meta.js
// ==/UserScript==

//=========================================================//
//=========================================================//
//  YOU SHOULD NO LONGER TOUCH ANYTHING INSIDE THE SCRIPT  //
//        EVERYTHING CAN NOW BE DONE FROM THE PAGE         //
//=========================================================//
//=========================================================//


//setting defaults
var dName = "";
var dMainCat = "Category";
var dSubCat = 0;
var dTitle = "";
var dDesc = "";
var dLang = 1;
var dCod = false;
var dTrailer = "";
var dRes = false;
var dForm = false;

var pageWidth = 75;
var descHeight = 13;

var catDescs = [];
var catDescString = "";

var cusDescs = [];
var cusDescString = "";

var IMDBs = [];
var IMDBsString = "";

(async function() { // Getting the runtime variables from local storage
    if( (await GM.getValue("pageWidth")) != null ) {
		pageWidth = await GM.getValue("pageWidth");
	}
    if( (await GM.getValue("descHeight")) != null ) {
		descHeight = await GM.getValue("descHeight");
	}
	if( (await GM.getValue("dName")) != null ) {
		dName = await GM.getValue("dName");
	}
	if( (await GM.getValue("dMainCat")) != null ) {
		dMainCat = await GM.getValue("dMainCat");
	}
	if( (await GM.getValue("dSubCat")) != null ) {
		dSubCat = await GM.getValue("dSubCat");
	}
	if( (await GM.getValue("dTitle")) != null ) {
		dTitle = await GM.getValue("dTitle");
	}
	if( (await GM.getValue("dDesc")) != null ) {
		dDesc = await GM.getValue("dDesc");
	}
    if( (await GM.getValue("dLang")) != null ) {
		dLang = await GM.getValue("dLang");
	}
    if( (await GM.getValue("dTrailer")) != null ) {
		dTrailer = await GM.getValue("dTrailer");
	}
    if( (await GM.getValue("dCod")) != null ) {
		dCod = await GM.getValue("dCod");
	}
    if( (await GM.getValue("dRes")) != null ) {
		dRes = await GM.getValue("dRes");
	}
    if( (await GM.getValue("dForm")) != null ) {
		dForm = await GM.getValue("dForm");
	}
	if( (await GM.getValue("catDescString")) != null ) {
		catDescString = await GM.getValue("catDescString");
		if(catDescString) {
            catDescs = JSON.parse(catDescString);
        }
	}
    if( (await GM.getValue("cusDescString")) != null ) {
		cusDescString = await GM.getValue("cusDescString");
		if(cusDescString) {
            cusDescs = JSON.parse(cusDescString);
        }
	}
    if( (await GM.getValue("IMDBsString")) != null ) {
		IMDBsString = await GM.getValue("IMDBsString");
		if(IMDBsString) {
            IMDBs = JSON.parse(IMDBsString);
        }
	}

	$("head").append(`
		<style>
			.dv-butt {
				margin: 1px;
			}

			.dvfu-cont {
				width: `+pageWidth+`%;
			}

			#pageWidthSet, #setDescHeight {
				float: right;
			}
			#dvfu-imdb-drop {
				float: right;
			}
		</style>
	`);
	mainScript();
})();

function mainScript() {
    $(function(){//wait for page load
        if(window.location.href.indexOf("upload-form") > -1) { //upload page
            $("#torrent_info__categories > option[value=Category]").removeAttr("selected");
            $("#torrent_info__categories > option[value="+dMainCat+"]").prop("selected", "selected");

            $("#torrent_info__categories").after('<button id="saveCat" class="dv-butt" style="float: right;">Save</button>');
            $("#saveCat").click(function(e){
                e.preventDefault();
                dMainCat = $("#torrent_info__categories").val();
                GM.setValue("dMainCat", dMainCat);
                $("#saveCat").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveCat").html('Save');
                },1200);
            });
        }
        else { //edit page (upload page 2)
            //set page width and add button to change it
            $(".mx-auto").prop("class", "mx-auto dvfu-cont").prepend('<button id="pageWidthSet">Set Page Width</button>');
            $("#pageWidthSet").click(function(e){
                e.preventDefault();
                var pageWidthTemp = parseInt(prompt("Give the page width (in percent):"), 10);
                if(pageWidthTemp && pageWidthTemp >= 10 && pageWidthTemp <= 100) {
                    pageWidth = pageWidthTemp;
                    GM.setValue("pageWidth", pageWidth);
                    $(".dvfu-cont").prop("style", "width: "+pageWidth+"%;");

                    $("#pageWidthSet").html('<span style="color: green;">Saved!</span>');
                    setTimeout(function(){
                        $("#pageWidthSet").html('Set Page Width');
                    },1200);
                }
            });

            //set desc box height
            $("#torrent_description").prop("rows", descHeight);

            //load defaults
            $("#torrent_info__subcategories > option[value=Sub-Category]").removeAttr("selected");
            $("#torrent_info__subcategories > option[value="+dSubCat+"]").prop("selected", "selected");
            $("#torrent_info__title").val(dTitle);
            $("#torrent_info__trailer").val(dTrailer);
            $("#torrent_info__language > option[value='']").removeAttr("selected");
            $("#torrent_info__language > option[value="+dLang+"]").prop("selected", "selected");
            if(dCod) { $("#torrent_info__video_codec > option[value="+dCod+"]").prop("selected", "selected"); }
            if(dRes) { $("#torrent_info__resolution > option[value="+dRes+"]").prop("selected", "selected"); }
            if(dForm) { $("#torrent_info__format > option[value="+dForm+"]").prop("selected", "selected"); }

            //load desc for current cat if found
            LoadDescForCat();

            //save subcat
            $("#torrent_info__subcategories").after('<button id="saveSubCat" class="dv-butt" style="float: right;">Save</button>');
            $("#saveSubCat").click(function(e){
                e.preventDefault();
                dSubCat = $("#torrent_info__subcategories").val();
                GM.setValue("dSubCat", dSubCat);
                $("#saveSubCat").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveSubCat").html('Save');
                },1200);
            });

            //save language
            $("#torrent_info__subcategories").after('<button id="saveSubCat" class="dv-butt" style="float: right;">Save</button>');
            $("#saveSubCat").click(function(e){
                e.preventDefault();
                dSubCat = $("#torrent_info__subcategories").val();
                GM.setValue("dSubCat", dSubCat);
                $("#saveSubCat").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveSubCat").html('Save');
                },1200);
            });

            //save codec
            $("#torrent_info__video_codec").after('<button id="saveCodec" class="dv-butt" style="float: right;">Save</button>');
            $("#saveCodec").click(function(e){
                e.preventDefault();
                dCod = $("#torrent_info__video_codec").val();
                GM.setValue("dCod", dCod);
                $("#saveCodec").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveCodec").html('Save');
                },1200);
            });

            //save resolution
            $("#torrent_info__resolution").after('<button id="saveRes" class="dv-butt" style="float: right;">Save</button>');
            $("#saveRes").click(function(e){
                e.preventDefault();
                dRes = $("#torrent_info__resolution").val();
                GM.setValue("dRes", dRes);
                $("#saveRes").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveRes").html('Save');
                },1200);
            });

            //save format
            $("#torrent_info__format").after('<button id="saveForm" class="dv-butt" style="float: right;">Save</button>');
            $("#saveForm").click(function(e){
                e.preventDefault();
                dForm = $("#torrent_info__format").val();
                GM.setValue("dForm", dForm);
                $("#saveForm").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveForm").html('Save');
                },1200);
            });

            //save title
            $("#torrent_info__language").after('<button id="saveLang" class="dv-butt" style="float: right;">Save</button>');
            $("#saveLang").click(function(e){
                e.preventDefault();
                dLang = $("#torrent_info__language").val();
                GM.setValue("dLang", dLang);
                $("#saveLang").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveLang").html('Save');
                },1200);
            });

            //save trailer
            $("#torrent_info__trailer").after('<button id="saveTrailer" class="dv-butt" style="float: right;">Save</button>');
            $("#saveTrailer").click(function(e){
                e.preventDefault();
                dTrailer = $("#torrent_info__trailer").val();
                GM.setValue("dTrailer", dTrailer);
                $("#saveTrailer").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveTrailer").html('Save');
                },1200);
            });

            //save default desc
            $("#torrent_description").after('<button id="saveDesc" class="dv-butt" style="float: right;">Save</button>');
            $("#saveDesc").click(function(e){
                e.preventDefault();
                dDesc = $("#torrent_description").val();
                GM.setValue("dDesc", dDesc);
                $("#saveDesc").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveDesc").html('Save');
                },1200);
            });

            //Cat specific desc save
            $("#torrent_description").after('<button id="saveDescForCat" class="dv-butt" style="float: right;">Save for category</button>');
            $("#saveDescForCat").click(function(e){
                e.preventDefault();
                var currentCat = $("#torrent_info__subcategories").val();
                var currentDesc = $("#torrent_description").val();
                var found = false;
                for(var i = 0, len = catDescs.length; i < len; i++) {
                    if(catDescs[i][0] == currentCat) {
                        catDescs[i][1] = currentDesc;
                        found = true;
                    }
                }
                if(!found) {
                    var catDescTemp = [currentCat, currentDesc];
                    catDescs.push(catDescTemp);
                }

                catDescString = JSON.stringify(catDescs); //turn array into a single string
                GM.setValue("catDescString", catDescString); //save that string to local storage

                $("#saveDescForCat").html('<span style="color: green;">Saved!</span>');
                setTimeout(function(){
                    $("#saveDescForCat").html('Save for category');
                },1200);
            });

            //imdb save
            $("#torrent_info__ttimdb").after('<button id="saveIMDB" class="dv-butt" style="float: right;">Save</button>');
            $("#saveIMDB").click(function(e){
                e.preventDefault();
                var currentIMDB = $("#torrent_info__ttimdb").val();
                var IMDBname = prompt("Give a name for this IMDB code:");
                if(IMDBname){
                    var found = false;
                    for(var i = 0, len = IMDBs.length; i < len; i++) {
                        if(IMDBs[i][0] == IMDBname) {
                            IMDBs[i][1] = currentIMDB;
                            found = true;
                        }
                        else if(IMDBs[i][1] == currentIMDB) {
                            IMDBs[i][0] = IMDBname;
                            found = true;
                        }
                    }
                    if(!found) {
                        IMDBs.push([IMDBname, currentIMDB]);
                    }

                    IMDBsString = JSON.stringify(IMDBs); //turn array into a single string
                    GM.setValue("IMDBsString", IMDBsString); //save that string to local storage

                    $("#saveIMDB").html('<span style="color: green;">Saved!</span>');
                    setTimeout(function(){
                        $("#saveIMDB").html('Save');
                    },1200);
                }
            });

            //load imdbs
            var SelectOptionsIMDB = "";
            for(let i = 0, len = IMDBs.length; i < len; i++) {
                SelectOptionsIMDB += "<option value='"+i+"'>"+IMDBs[i][0]+"</option>\n";
            }

            //show imdbs
			$("#torrent_info__ttimdb").before(`
				<select id="dvfu-imdb-drop">
					<option selected disabled>Saved IMDB codes...</option>
					`+SelectOptionsIMDB+`
				</select>
			`);

            //custom desc save
            $("#torrent_description").after('<button id="saveDescForCus" class="dv-butt" style="float: right;">Save as Custom</button>');
            $("#saveDescForCus").click(function(e){
                e.preventDefault();
                var currentDesc = $("#torrent_description").val();
                var cusname = prompt("Give a name for this custom Description:");
                if(cusname){
                    var found = false;
                    for(var i = 0, len = cusDescs.length; i < len; i++) {
                        if(cusDescs[i][0] == cusname) {
                            catDescs[i][1] = currentDesc;
                            found = true;
                        }
                    }
                    if(!found) {
                        cusDescs.push([cusname, currentDesc]);
                    }

                    cusDescString = JSON.stringify(cusDescs); //turn array into a single string
                    GM.setValue("cusDescString", cusDescString); //save that string to local storage

                    $("#saveDescForCus").html('<span style="color: green;">Saved!</span>');
                    setTimeout(function(){
                        $("#saveDescForCus").html('Save as Custom');
                    },1200);
                }
            });

            //load custom descs
            var SelectOptionsCus = "";
            for(let i = 0, len = cusDescs.length; i < len; i++) {
                SelectOptionsCus += "<option value='"+i+"'>"+cusDescs[i][0]+"</option>\n";
            }

            //show custom descs
			$("div.bbcode_editor").before(`
				<select id="dvfu-cus-drop">
					<option selected disabled>Saved Custom Descriptions...</option>
					`+SelectOptionsCus+`
				</select>
			`);

            //description height button
            $("div.bbcode_editor").before('<button id="setDescHeight">Description height</button>');
            $("#setDescHeight").click(function(e){
                e.preventDefault();
                var descHeightTemp = parseInt(prompt("Give the Description box height (row count):"), 10);
                if(descHeightTemp && descHeightTemp >= 1 && descHeightTemp <= 100) {
                    descHeight = descHeightTemp;
                    GM.setValue("descHeight", descHeight);
                    $("#torrent_description").prop("rows", descHeight);

                    $("#setDescHeight").html('<span style="color: green;">Saved!</span>');
                    setTimeout(function(){
                        $("#setDescHeight").html('Description height');
                    },1200);
                }
            });

            //apply selected custom desc
            $("#dvfu-cus-drop").change(function(){
                $("#torrent_description").val(cusDescs[$("#dvfu-cus-drop").val()][1]);
            });

            //apply selected imdb
            $("#dvfu-imdb-drop").change(function(){
                $("#torrent_info__ttimdb").val(IMDBs[$("#dvfu-imdb-drop").val()][1]);
            });

            //load desc for category on category change
            $("#torrent_info__subcategories").change(function(){
                LoadDescForCat();
            });
        }
    });
}

function LoadDescForCat() {
    for(var i = 0, len = catDescs.length; i < len; i++) {
        if(catDescs[i][0] == $("#torrent_info__subcategories").val()) {
            $("#torrent_description").val(catDescs[i][1]);
            return;
        }
    }
    $("#torrent_description").val(dDesc);
}




