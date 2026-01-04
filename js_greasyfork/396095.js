// ==UserScript==
// @name         [CT] Change color of target
// @namespace    CyberTown
// @date         15/12/2019
// @version      1.0
// @description  Change the color of the target in the chat
// @author       .1019
// @include      https://cybertown.fr/ingame.php
// @include      https://cybertown.fr/ingame.php?sidebar_menu
// @downloadURL https://update.greasyfork.org/scripts/396095/%5BCT%5D%20Change%20color%20of%20target.user.js
// @updateURL https://update.greasyfork.org/scripts/396095/%5BCT%5D%20Change%20color%20of%20target.meta.js
// ==/UserScript==

$('<a class="target" style="height: auto; padding: 0px 10px;"><label for="targetname">[SCRIPT] Changecolor :</label><input id="targetname" name="targetname" type="text" placeholder="Entrez un pseudo" style="box-shadow: none; background: #ffffff1a; width: 100%; margin: 0 0 10px 0; box-sizing: border-box;"><input id="colorname" name="colorname" type="text" placeholder="Entrez une couleur en hexadécimal" style="box-shadow: none; background: #ffffff1a; width: 100%; margin: 0; box-sizing: border-box;"><input class="addtarget" type="submit" value="Ajouter"></a>').insertAfter('a[title="Déconnexion"]');

var colorTagStyle = $('<style id="colorTagStyle">').appendTo("head");

$(".addtarget").click(function() {
    var add = $(this).closest("a.target").find("input[name='targetname']").val();
    var color = $(this).closest("a.target").find("input[name='colorname']").val();

    $("div.miaou").each(function(){
        var str = $(this).text();
        var res = str.split(" ");
        var name = res[1];
        if(name == add || name == add + ":") {
            var idtarget = $(this).attr('id_perso_tchat');
            var attr = 'div[id_perso_tchat="' + idtarget + '"]'
            var newRule = attr + '{color: '+ color +';}\n';
            colorTagStyle.text(colorTagStyle.text() + newRule);
        }
    });
});