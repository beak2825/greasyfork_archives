// ==UserScript==
// @name         JS and CSS on Feeder. V.2
// @version      2.0.0
// @description  It helps your life customizing Feeder.
// @author       はー / h /
// @match        *.x-feeder.info/*
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace https://greasyfork.org/users/534841
// @downloadURL https://update.greasyfork.org/scripts/401722/JS%20and%20CSS%20on%20Feeder%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/401722/JS%20and%20CSS%20on%20Feeder%20V2.meta.js
// ==/UserScript==

// Remove Ads
$("#main_right div:first").remove();
$("#main_right div:last").remove();

// Load Saved Data
(async () => {
    let css_first = await GM.getValue("css_save");
    let js_first = await GM.getValue("js_save");

// Add JS Textarea
$("head").append(`<div id="scripts"><script>` + js_first + `</script></div>`)

$("#main_right").prepend(`<textarea id="js_code" style="width: 300px; height: 250px; margin-bottom: 8px;">` + js_first + `</textarea>`);

$(function() {
    $('textarea[id="js_code"]').keyup(function() {
        const js_code = $("#js_code").val();
        $("#scripts").append("<script>" + js_code + "</script>");
        $("#scripts").empty();
    });
});

// Add CSS Textarea
$("head").append(`<style type="text/css" id="css">` + css_first + `</style>`);

$("#main_right").prepend(`<textarea id="css_code" style="width: 300px; height: 250px; margin-bottom: 8px;">` + css_first + `</textarea>`);

$(function() {
    $('textarea[id="css_code"]').keyup(function() {
        const css_code = $("#css_code").val();
            $("#css")[0].innerHTML = css_code ;
    });
});

})();

// Add Description
$("#feeder_links_frame").after(`
<div id="about_this_script">
Save: Ctrl + S<br>
Load: Ctrl + L
</div>
`);

// Input It in CSS Textarea If You Want
/*
div#about_this_script{
    background-color: #FFFFFF;
    margin-bottom: 8px;
    padding: 4px;
    border-radius: 8px;
    dispray: block;
}
*/

// Save ( Ctrl + S )
$(window).keydown(function (e) {
    if (event.shiftKey) {
        if (e.keyCode === 83) {
            (async () => {
                await GM.setValue('css_save', $("#css_code").val());
                await GM.setValue('js_save', $("#js_code").val());
                alert("Your code is saved !");
            })();
        }
    }
});

// Load ( Ctrl + L )
$(window).keydown(function (e) {
    if (event.shiftKey) {
        if (e.keyCode === 76) {
            (async () => {
                let css_load = await GM.getValue('css_save');
                let js_load = await GM.getValue('js_save');
                $("#css_code").val(css_load);
                $("#js_code").val(js_load);
                alert("Loaded !")
            })();
        }
    }
});