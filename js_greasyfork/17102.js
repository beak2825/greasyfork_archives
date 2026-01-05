// ==UserScript==
// @name        JR Mturk Noblis Image Finder Helper
// @namespace   https://greasyfork.org/users/6406
// @description Makes it easier to select answer for images of people.
// @version     0.18
// @require     http://code.jquery.com/jquery-1.10.2.min.js
// @include     http*://s3.amazonaws.com/TurkAnnotator*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17102/JR%20Mturk%20Noblis%20Image%20Finder%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/17102/JR%20Mturk%20Noblis%20Image%20Finder%20Helper.meta.js
// ==/UserScript==

var OPEN_URL_AUTO = true;
var CLOSE_POPWINDOW_AFTER = true;

var gQuestions = [];
var gQuestionIndex = 0;
var gOpenedWindow = null;
var gSubmitGo = false;

function checkIdDirections(instructionID,instructionText) {
    var theValue = $("#" + instructionID + ":contains('" + instructionText + "')").length;
    if ($("#" + instructionID).css('display') == "block") return theValue;
    else return false;
}
function isNoblisImages() { return checkIdDirections("instructions_subject_present","Determine whether the person represented by this google image link"); }
function isNoblisAgeImages() { return checkIdDirections("instructions_age","For this task, estimate the age of the person boxed, as best you can."); }
function isNoblisEyeIMages() { return checkIdDirections("instructions_eyes_visible","focus on the eye region of the boxed face in each image"); }
function isNoblisMouthIMages() { return checkIdDirections("instructions_nose_mouth_visible","focus on the nose and mouth region of the boxed face in each image"); }
function isNoblisForeheadIMages() { return checkIdDirections("instructions_forehead_visible","focus on the forehead region of the boxed face in each image as shown below"); }
function isNoblisFacialHairIMages() { return checkIdDirections("instructions_facial_hair","Select the facial hair type that is closest to the person shown below"); }
function isNoblisIndoorOutdoorIMages() { return checkIdDirections("instructions_indoor_outdoor","For this task, choose \"Indoor\" when:"); }
function isNoblisRightEye() { return checkIdDirections("instructions_right_eye_landmark","Click on the center of the person\'s right eye as shown below."); }
function isNoblisLeftEye() { return checkIdDirections("instructions_left_eye_landmark","Click on the center of the person\'s left eye as shown below."); }
function isNoblisNoseBase() { return checkIdDirections("instructions_nose_base_landmark","Click on the center of the base of the person\'s nose as shown below."); }
function isNoblisFindSubject() { return checkIdDirections("instructions_subject_present","face is in the image below by studying the images at"); }
function isNoblisQualityControl() { return checkIdDirections("instructions_golden_review","We are performing quality control on images where the faces have been marked with bounding boxes."); }
function isNoblisGridOcclusion() { return checkIdDirections("instructions_grid_occlusion","For this HIT, we are interested in which areas on the person's face are covered or partially covered."); }

$(function() {
    setTimeout( function() {
        if ( isNoblisImages() ) {
            console.log("Found Noblis Images");
            if (OPEN_URL_AUTO) {
                var personLink = $("#person_link").attr("href");
                var windowWidth = "width=" + screen.width/2;
                var windowHeight = "height=" + (screen.height-(screen.height/10));
                var windowPosition = "left=0," + windowHeight + "," + windowWidth + ",top=0";
                if (personLink) {
                    gOpenedWindow = window.open(personLink,"imagesearch",windowPosition);
                    if (gOpenedWindow) gOpenedWindow.blur();
                    window.focus();
                }
            }
            if ($("#img_boundary")) {
                $("#img_boundary > div").each( function(i,theObject) {
                    if (i>0) {
                        $(theObject).find("div:first").width("140px");
                        $(theObject).find("img:first").css( {marginLeft : "130px"} );
                        $(theObject).find(":radio:eq(0)")[0].nextSibling.nodeValue = "Present (1)";
                        $(theObject).find(":radio:eq(1)")[0].nextSibling.nodeValue = "Not Present (2)";
                        $(theObject).find(":radio:eq(1)").click();
                        $(theObject).find(":radio:eq(2)")[0].nextSibling.nodeValue = "Can't tell (3)";
                        $(theObject).find(":radio:eq(3)")[0].nextSibling.nodeValue = "no Image (0)";
                        gQuestions.push(theObject);
                    }
                });
                $(gQuestions[gQuestionIndex]).css( "background-color", "#66CCCC" );
                $(document).keydown(function(event) {
                    //console.log(gQuestions.length);
                    if (gQuestionIndex<gQuestions.length) {
                        var goToNext = false;
                        if (event.which == 49 || event.which == 97) { // 1 - Present
                            $(gQuestions[gQuestionIndex]).find(":radio:eq(0)").click();
                            goToNext=true;
                        }
                        if (event.which == 50 || event.which == 98) { // 2 - Not Present
                            $(gQuestions[gQuestionIndex]).find(":radio:eq(1)").click();
                            goToNext=true;
                        }
                        if (event.which == 51 || event.which == 99) { // 3 - Can't Tell
                            $(gQuestions[gQuestionIndex]).find(":radio:eq(2)").click();
                            goToNext=true;
                        }
                        if (event.which == 48 || event.which == 96) { // 0 - Image Not Loaded
                            $(gQuestions[gQuestionIndex]).find(":radio:eq(3)").click();
                            goToNext=true;
                        }
                        if (goToNext) {
                            $(gQuestions[gQuestionIndex]).css( "background-color", "" );
                            gQuestionIndex++;
                            if (gQuestionIndex>=gQuestions.length) $("#button_div").css( "background-color", "#66CCCC" );
                            else {
                                $('html, body').animate({
                                    scrollTop: $(gQuestions[gQuestionIndex]).offset().top-21
                                }, 700);
                                $(gQuestions[gQuestionIndex]).css( "background-color", "#66CCCC" );
                            }
                        }
                    } else if (	event.which == 13) {
                        $("#submitbutton").click();
                        event.preventDefault();
                        event.stopPropagation();
                        if (OPEN_URL_AUTO && CLOSE_POPWINDOW_AFTER && gOpenedWindow) gOpenedWindow.close();
                   }
                });
            }
        } else if ( isNoblisRightEye() || isNoblisLeftEye() || isNoblisNoseBase() ) {
            console.log("left or right eye or Nose Base"); // nextbutton notvisiblebutton
            $("#nextbutton").html($("#nextbutton").html() + " (1)");
            $("#notvisiblebutton").html($("#notvisiblebutton").html() + " (2)");
            $(document).keydown(function(event) {
                if (event.which == 49 || event.which == 97) { // 1 - Next
                    if ($("#submitbutton").css('display') == "none") {
                        $("#nextbutton").click();
                        $("#nextbutton").css("background-color","#66FFFF");
                        $("#notvisiblebutton").css("background-color","#E8E8E8");
                    } else if ($("#submitbutton").css('display') == "inline") $("#submitbutton").click();
                }
                if (event.which == 50 || event.which == 98) { // 2 - Not Visible
                    $("#notvisiblebutton").click();
                    $("#notvisiblebutton").css("background-color","#66FFFF");
                    $("#nextbutton").css("background-color","#E8E8E8");
                }
            });
		} else if ( isNoblisGridOcclusion() ) {
			console.log("Grid Occlusion");
			$("#nextbutton").focus();
			$("#annotator_div").append($("<div>").css({"margin-top":"400px"}));
			var theCanvas =  ($("#thecanvas").length) ? $("#thecanvas") : $("#img_boundary");
			$('html, body').animate({
				scrollTop: $(theCanvas).offset().top-25
			}, 700);
			$("#noocclusionbutton").html($("#noocclusionbutton").html() + " (1)" );
			$("#nextbutton").html($("#nextbutton").html() + " (2)" );
			$("#submitbutton").html($("#submitbutton").html() + " (2)" );
            $(document).keydown(function(event) {
				var submitButtonHidden = $("#submitbutton").css("display") == "none";
				console.log( " Next: " + $("#nextbutton").css("display") + " - submit: " + $("#submitbutton").css("display") + " - variable: " + submitButtonHidden);
				if (event.which == 49 || event.which == 97) $("#noocclusionbutton").click(); // 1 - No Occlusion
				else if ( (event.which == 50 || event.which == 98) && submitButtonHidden ) $("#nextbutton").click(); // 2 - next picture
				else if ( (event.which == 50 || event.which == 98) && !submitButtonHidden ) $("#submitbutton").click(); // 2 - submit hit
            });
		} else if ( isNoblisQualityControl() ) {
			console.log("Quality Control");
			$("#nextbutton").focus();
			$("#annotator_div").append($("<div>").css({"margin-top":"400px"}));
			var theCanvas =  ($("#thecanvas").length) ? $("#thecanvas") : $("#img_boundary");
			$('html, body').animate({
				scrollTop: $(theCanvas).offset().top-25
			}, 700);
			$("input[value='OK in all regards']:first").prop( "checked", true );
			$("input[value='bad box or boxes']:first")[0].nextSibling.nodeValue = "bad box or boxes (1)";
			$("input[value='missing box or boxes']:first")[0].nextSibling.nodeValue = "missing box or boxes (2)";
			$("input[value='extra box or boxes']:first")[0].nextSibling.nodeValue = "extra box or boxes (3)";
			$("input[value='OK in all regards']:first")[0].nextSibling.nodeValue = "OK in all regards (4)";
            $("#button_div").append($('<div>').html("Press 0 or n for next picture after bad, missing or extra boxes").css("margin-top","20px"));
			$("#image").on("load", function() {
				$("#button_div").css({"opacity":1.0});
				var theCanvas =  ($("#thecanvas").length) ? $("#thecanvas") : $("#img_boundary");
				$('html, body').animate({
					scrollTop: $(theCanvas).offset().top-25
				}, 700);
				$("input[value='OK in all regards']:first").prop( "checked", true );
			});
            $(document).keydown(function(event) {
				var goToNext = false;
				if (event.which == 78 || event.which == 48 || event.which == 96) {
					var submitButtonHidden = $("#submitbutton").css("display") == "none";
					if ( (event.which == 48 || event.which == 96) && submitButtonHidden) $("#nextbutton").click();
					$("#button_div").css({"opacity":0.3});
					if (!submitButtonHidden) {
						if (gSubmitGo) $("#button_div").css({"opacity":0.3,"background-color":"red"});
						$("#submitbutton").focus();
						gSubmitGo = true;
					}
				}
                if (event.which == 49 || event.which == 97) { // 1 - bad box or boxes
					$("input[value='bad box or boxes']:first").prop( "checked", true );
					$("input[value='OK in all regards']:first").prop( "checked", false );
				}
                if (event.which == 50 || event.which == 98) { // 2 - missing box or boxes
					$("input[value='missing box or boxes']:first").prop( "checked", true );
					$("input[value='OK in all regards']:first").prop( "checked", false );
				}
                if (event.which == 51 || event.which == 99) { // 3 - extra box or boxes
					$("input[value='extra box or boxes']:first").prop( "checked", true );
					$("input[value='OK in all regards']:first").prop( "checked", false );
				}
                if (event.which == 52 || event.which == 100) { // 4 - OK in all regards
					$("input[value='bad box or boxes']:first").prop( "checked", false );
					$("input[value='missing box or boxes']:first").prop( "checked", false );
					$("input[value='extra box or boxes']:first").prop( "checked", false );
					$("input[value='OK in all regards']:first").prop( "checked", true );
					goToNext=true;
				}
				if (goToNext) {
					if ($("#submitbutton").css("display") == "none") {
						$("#nextbutton").click(); $("#nextbutton").focus(); 
						$("#button_div").css({"opacity":0.3});
					}
					else { $("#button_div").css({"opacity":0.3,"background-color":"red"}); $("#submitbutton").focus(); gSubmitGo = true; }
				}
                if (event.which == 13 && !gSubmitGo) { // enter is disabled unless submit button is displayed.
					return false;
				}
            });
        } else if ( isNoblisEyeIMages() || isNoblisMouthIMages() || isNoblisForeheadIMages() || isNoblisFacialHairIMages() || isNoblisIndoorOutdoorIMages() || isNoblisAgeImages()  || isNoblisFindSubject() ) {
			var facialHairHit = isNoblisFacialHairIMages();
			var indoorOutdoorHit = isNoblisIndoorOutdoorIMages();
			var ageHit = isNoblisAgeImages();
			var findSubject = isNoblisFindSubject();
			$("#nextbutton").focus();
			$("#annotator_div").append($("<div>").css({"margin-top":"300px"}));
			$("#annotator_div input:radio").each( function(index,value) {
				$("#annotator_div").find(":radio:eq(" + index + ")")[0].nextSibling.nodeValue = "(" + (index+1) + ") " + $("#annotator_div").find(":radio:eq(" + index + ")")[0].nextSibling.nodeValue;
			});
			var theCanvas =  ($("#thecanvas").length) ? $("#thecanvas") : $("#img_boundary");
			$('html, body').animate({
				scrollTop: $(theCanvas).offset().top-25
			}, 700);
			$("#image").on("load", function() { 
				$("#button_div").css({"opacity":1.0});
				var theCanvas =  ($("#thecanvas").length) ? $("#thecanvas") : $("#img_boundary");
				$('html, body').animate({
					scrollTop: $(theCanvas).offset().top-25
				}, 700);
			});
            $(document).keydown(function(event) {
				var goToNext = false;
                if (event.which == 49 || event.which == 97) { // 1 - Covered Or Beard or indoor or (0-19)
                    if (indoorOutdoorHit) $("input[value='indoor']:first").click();
                    else if (facialHairHit) $("input[value='beard']:first").click();
                    else if (ageHit) $("input[value='0-19']:first").click();
                    else if (findSubject) $("input[value='Present']:first").click();
                    else $("input[value='covered or partially covered']:first").click();
					goToNext=true;
                }
                if (event.which == 50 || event.which == 98) { // 2 - Not Covered or Moustache or outdoor or (20-34)
                    if (indoorOutdoorHit) $("input[value='outdoor']:first").click();
                    else if (facialHairHit) $("input[value='moustache']:first").click();
                    else if (ageHit) $("input[value='20-34']:first").click();
                    else if (findSubject) $("input[value='Not present']:first").click();
                    else $("input[value='not covered']:first").click();
					goToNext=true;
                }
                if (event.which == 51 || event.which == 99) { // 3 - bad box or Goatee or (35-49)
                    if (facialHairHit) $("input[value='goatee']:first").click();
                    else if (ageHit) $("input[value='35-49']:first").click();
                    else if (findSubject) $("input[value='Can't tell']:first").click();
                    else $("input[value='bad box']:first").click();
					goToNext=true;
                }
                if (event.which == 52 || event.which == 100 && (facialHairHit || ageHit || findSubject)) { // 4 - none or (50-64)
                    if (ageHit) $("input[value='50-64']:first").click();
                    else if (findSubject) $("input[value='Search results unclear']:first").click();
                    else $("input[value='none']:first").click();
					goToNext=true;
                }
                if (event.which == 53 || event.which == 101 && (facialHairHit || ageHit || findSubject)) { // 5 - not visible or (65+)
                    if (ageHit) $("input[value='65+']:first").click();
                    else if (findSubject) $("input[value='Image not loaded']:first").click();
                    else $("input[value='not visible']:first").click();
					goToNext=true;
                }
                if (event.which == 54 || event.which == 102 && (facialHairHit || ageHit)) { // 6 - bad box
                    $("input[value='bad box']:first").click();
					goToNext=true;
                }
				if (goToNext) {
					if ($("#submitbutton").css("display") == "none") setTimeout( function() {
							$("#nextbutton").click(); $("#nextbutton").focus(); 
							$("#button_div").css({"opacity":0.3});
						}, 400);
					else { $("#submitbutton").focus(); gSubmitGo = true; }
				}
                if (event.which == 13 && !gSubmitGo) { // enter
					return false;
				}
            });
		}
    }, 1303);
});
