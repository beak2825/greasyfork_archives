// ==UserScript==
// @name         Colorful Paragraphs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Takes a 'p' tag. Fucks it up and spits out a fucking rainbow!! Making text practically un-readable. 
// @author       feedmegrizzly
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395245/Colorful%20Paragraphs.user.js
// @updateURL https://update.greasyfork.org/scripts/395245/Colorful%20Paragraphs.meta.js
// ==/UserScript==

window.onload = function(){
    var colors = ["red", "green", "blue", "teal", "fuchsia", "purple", "orange"];
    var paragraphs = document.querySelectorAll('p');

    //-----------------------------------------------------

    function get_words(paragraphs){
        var result = []
        for(var paragraph of paragraphs){
            try{
                result.push(paragraph.innerText.split(""));
            }
            catch(err){console.log(err)}
        }
        return result
    };

    //-----------------------------------------------------

    function add_color_style(paragraphs, colors){
        var color_index = 0
        for(var i = 0; i < paragraphs.length; i++){
            for(var j = 0; j < paragraphs[i].length; j++){
                if(color_index >= colors.length){
                    color_index = 0
                }
                paragraphs[i][j] = "<span style='color:" + colors[color_index] + "'>" + paragraphs[i][j] + "</span>"
                color_index++
            }
            paragraphs[i] = paragraphs[i].join("")
        }
        set_text_to_dom(paragraphs)
    };

    //-----------------------------------------------------

    function set_text_to_dom(paragraphs){
        var old_p = document.querySelectorAll('p');
        for(var i = 0; i < old_p.length; i++){
            old_p[i].innerHTML = paragraphs[i]
        }
        return
    }


    add_color_style(get_words(paragraphs),colors);
}