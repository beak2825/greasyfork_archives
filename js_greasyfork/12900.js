// ==UserScript==
// @name        jawz Web Test
// @version     1.4.1
// @author      jawz
// @match       https://s3.amazonaws.com/mturk_bulk/hits/*      
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_setClipboard
// @grant       GM_deleteValue
// @run-at      document-end
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @description kjdkfj
// @downloadURL https://update.greasyfork.org/scripts/12900/jawz%20Web%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/12900/jawz%20Web%20Test.meta.js
// ==/UserScript==
//if ($('h3)').length) {
    var Turl = $('a').attr("href");
    //var Turl = $('h3').text().split('profile:')[1]
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    popupX = window.open(Turl,'remote1','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    window.onbeforeunload = function (e) { popupX.close(); }

    GM_xmlhttpRequest ({
        method: "GET",
        url: Turl,
        onload: function (results) {
            var data = $(results.responseText);
            if (results.finalUrl == 'https://www.wellsfargoadvisors.com')
                $('#Q5LinktoWebpage[value="No"]').prop( "checked", true );
            else {
                $('#Q1LinktoWebpage[value="Yes"]').prop( "checked", true );
                
                
                if (!data.find('#nameTitle').find('h2').eq(0).text().length)
                    var job = data.find('#nameTitle').find('h2').eq(1).text();
                else
                    var job = data.find('#nameTitle').find('h2').eq(0).text();
                $('#Q2JobTitle').val(job);
                $('#Q3aName[value="Yes"]').prop( "checked", true );
                $('#Q3bAddress[value="Yes"]').prop( "checked", true );
                $('#Q3cPhone[value="Yes"]').prop( "checked", true );
                $('#Q3dEmail[value="Yes"]').prop( "checked", true );
                //$('#Q3eBackground[value="No"]').prop( "checked", true );
                $('#Q3fBackground[value="No"]').prop( "checked", true );
                $('#Q3gFirstPersonPoV[value="No"]').prop( "checked", true );
                $('#Q3hAssociate[value="No"]').prop( "checked", true );
                $('#Q3iExperience[value="No"]').prop( "checked", true );
                $('#Q3jEducation[value="No"]').prop( "checked", true );
                $('#Q3kAreasofFocus[value="No"]').prop( "checked", true );
                $('#Q3lCommunityInvolvement[value="No"]').prop( "checked", true );
                
                
                $('input[name="Q3ePhoto"]').click(function() {
                    $('#submitButton').click();
                });
                if (data.find('h2:contains(My Background)').length)
                    $('#Q3fBackground[value="Yes"]').prop( "checked", true );
                if (data.find('#myAssociates').text().trim().length)
                    $('#Q3hAssociate[value="Yes"]').prop( "checked", true );
                if (data.find('h2:contains(My Experience)').length)
                    $('#Q3iExperience[value="Yes"]').prop( "checked", true );
                if (data.find('h2:contains(My Education & Credentials)').length)
                    $('#Q3jEducation[value="Yes"]').prop( "checked", true );
                if (data.find('h2:contains(My Areas of Focus)').length)
                    $('#Q3kAreasofFocus[value="Yes"]').prop( "checked", true );
                if (data.find('h2:contains(My Community Involvement)').length)
                    $('#Q3lCommunityInvolvement[value="Yes"]').prop( "checked", true );
            }
        }
	});
//}