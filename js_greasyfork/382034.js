// ==UserScript==
// @name         Veneficium - Mise en Forme Automatique
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.veneficium.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382034/Veneficium%20-%20Mise%20en%20Forme%20Automatique.user.js
// @updateURL https://update.greasyfork.org/scripts/382034/Veneficium%20-%20Mise%20en%20Forme%20Automatique.meta.js
// ==/UserScript==

var $ = window.$;

var narration = ["[i]","[/i]"];
var parole = ["[b]","[/b]"];
var indicateurDeParole = '"';
var doitFermerParole = true;

$(document).ready(function(){
    if($("div.sceditor-toolbar").length > 0 && localStorage.getItem('autoform')){

        var $331autoformButton = $('<a class="sceditor-button-custom sceditor-button-autoform" unselectable="on" title="Mise en forme automatique"><div unselectable="on">Mise en forme automatique</div></a>');
        var css = $('<style>.sceditor-button-custom div, div.sceditor-grip { background-repeat: no-repeat; height: 16px; width: 16px } .sceditor-button-custom { -moz-background-clip: padding; -moz-border-radius: 3px; -webkit-background-clip: padding-box; -webkit-border-radius: 3px; background-clip: padding-box; border-radius: 3px; cursor: pointer; cursor: pointer; float: left; height: 20px; padding: 3px 5px; text-indent: -9999px; width: 16px } .ie .sceditor-button-custom { text-indent: 0 } .ie6 .sceditor-button-custom, .ie7 .sceditor-button-custom { display: inline; float: none!important; zoom: 1 } .ie6 .sceditor-button-custom { padding: 0 } .ie6 .sceditor-button-custom div { margin: 5px } .ie7 .sceditor-button-custom div { margin: 5px 0 } .sceditor-button-custom.active, .sceditor-button-custom:active, .sceditor-button-custom:hover { -moz-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.3), inset -1px 0 rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2); -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.3), inset -1px 0 rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2); background: #fff; box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.3), inset -1px 0 rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2) } .sceditor-button-custom:active { -moz-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.3), inset -1px 0 rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2), inset 0 0 8px rgba(0, 0, 0, 0.3); -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.3), inset -1px 0 rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2), inset 0 0 8px rgba(0, 0, 0, 0.3); background: #fff; box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.3), inset -1px 0 rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2), inset 0 0 8px rgba(0, 0, 0, 0.3) } .sceditor-button-custom.disabled:hover { -moz-box-shadow: none; -webkit-box-shadow: none; background: inherit; box-shadow: none; cursor: default; cursor: default } .sceditor-button-custom, .sceditor-button-custom div { display: block } .sceditor-button-custom div { color: transparent; font-size: 0; line-height: 0; margin: 2px 0; overflow: hidden; padding: 0 } .sceditor-button-custom.disabled div { filter: alpha(opacity=30); opacity: .3 } .sceditor-button-custom.text, .sceditor-button-custom.text div, .sceditor-button-custom.text-icon, .sceditor-button-custom.text-icon div, .text .sceditor-button-custom, .text .sceditor-button-custom div, .text-icon .sceditor-button-custom, .text-icon .sceditor-button-custom div { color: inherit; font-size: 1em; line-height: 16px; overflow: visible; text-indent: 0; width: auto } .sceditor-button-custom.text div, .text .sceditor-button-custom div { background: 0; padding: 0 2px } .sceditor-button-custom.text-icon div, .text-icon .sceditor-button-custom div { padding: 0 2px 0 20px } .rtl .sceditor-button-custom { float: right }</style>');
        $(document.body).append(css);
        $331autoformButton.find('div').css('background-image','url("https://i.imgur.com/VWBHiLm.png")');
        $331autoformButton.on('click', function(){
            var post = $(this).parent().parent().parent().find('textarea')[0].value;
            var response = '';
            if (post && post !== ''){
                post = splitLines(post);
                for(var i = 0; i<post.length; i++){
                    if(doitFermerParole == false){
                        if(post[i].indexOf(indicateurDeParole) == 0){
                            post[i] = parole[0] + post[i] + parole[1];
                        }else if(post[i] !== ""){
                            post[i] = narration[0] + post[i] + narration[1];
                        }
                    }else{
                        if(post[i].indexOf(indicateurDeParole) > -1){
                            var pair = true;
                            var startsWithoutNarration = true;
                            var tempPost = '';
                            for (var char in post[i]){
                                if(post[i][char] == indicateurDeParole){
                                    if(pair){
                                        if(startsWithoutNarration){
                                            tempPost += parole[0] + post[i][char];
                                            startsWithoutNarration = false;
                                        }else{
                                            tempPost += narration[1] + parole[0] + post[i][char];
                                            startsWithoutNarration = false;
                                        }
                                        pair = false;
                                    }else{
                                        if(char == (post[i].length-1)){
                                            tempPost += post[i][char] + parole[1];
                                        }else{
                                            tempPost += post[i][char] + parole[1] + narration[0];
                                        }
                                        pair = true;
                                    }
                                }else{
                                    if(char == 0){
                                        tempPost += narration[0];
                                        startsWithoutNarration = false;
                                    }

                                    tempPost += post[i][char];

                                    if(char == (post[i].length-1)){
                                        tempPost += narration[1];
                                    }
                                }
                            }
                            post[i] = tempPost;
                        }else if(post[i] !== ""){
                            post[i] = narration[0] + post[i] + narration[1];
                        }
                    }
                    response += ((i == (post.length-1)) ? (post[i]) : (post[i] + '\n'));
                }
                $(this).parent().parent().parent().find('textarea')[0].value = response;
            }
        });
        $331autoformButton.insertAfter($('a.sceditor-button.sceditor-button-justify'));
    } else if($("div.sceditor-toolbar").length > 0){
        $($(this).parent().parent().parent().find('textarea')[0].form).submit(function() {
            var post = $(this).parent().parent().parent().find('textarea')[0].value;
            var response = '';
            if (post && post !== ''){
                post = splitLines(post);
                for(var i = 0; i<post.length; i++){
                    var opener = /\[.+?\]/.exec(post[i]);
                    var finisher = /\[\\.+?\]/.exec(post[i]);
                    var indicParole = ' ';
                    var boucle = 1;
                    if(opener && finisher){
                        while (indicParole = ' '){
                            indicParole = post[i].substring((opener.index + opener.length), (opener.index + opener.length + boucle));
                            boucle++;
                        }
                    }
                }
            }
            return true;
        });
    }
});

function splitLines(t) {
    return t.split(/\r\n|\r|\n/);
}