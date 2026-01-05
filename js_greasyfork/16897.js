// ==UserScript==
// @name         The West - Joueurs présents
// @version      1.03
// @description  Compare les joueurs présents aux batailles
// @author       Thathanka Iyothanka
// @include		http*://*.the-west.*/game.php*
// @include		http*://*.the-west.*.*/game.php*
// @grant        none

// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/16897/The%20West%20-%20Joueurs%20pr%C3%A9sents.user.js
// @updateURL https://update.greasyfork.org/scripts/16897/The%20West%20-%20Joueurs%20pr%C3%A9sents.meta.js
// ==/UserScript==
setTimeout(function() {
(function (fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}) (function () {
    
    var fb_first={fortId:0,side:0,data:[]}
    var fb_second={fortId:0,side:0,data:[]}
    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
    Array.prototype.defense = function(a) {
        return this.filter(function(i) {return i.battle_type == "defender";});
    };
    Array.prototype.attack = function(a) {
        return this.filter(function(i) {return i.battle_type == "attacker";});
    };
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
    CemeteryWindow.showStatUpdateTableOrigin=CemeteryWindow.showStatUpdateTable
    CemeteryWindow.showStatUpdateTable=function(data){
        CemeteryWindow.showStatUpdateTableOrigin.call(this,data)
        var button = $("<div  style='position:absolute;top:0px;left:600px;width:25px;height:25px;cursor:pointer;background:url(https://i.imgur.com/KwjO5eZ.png)' title='Comparer cette bataille'/>")
        $('div.footer',CemeteryWindow.DOM).append(button)
        button.on('click',function(){
            new west.gui.Dialog('Comparaison','<div style="text-align:center;"><p>Quel camp souhaitez-vous comparer ?</p></br><img src="/images/fort/battle/button_chooseside.png"/></div>', west.gui.Dialog.SYS_QUESTION).addButton('Attaque', function(){get_list('attack')}).addButton('Défense',function(){get_list('defense')}).addButton('cancel').show()
        })
    }
    var get_list=function(side){
        if ((fb_first.fortId===0)||(fb_second.fortId!==0)){
            if (side=='defense'){
                fb_first.side='défense'
                fb_first.data=CemeteryWindow.currentStats.defense()
            } else {
                fb_first.side='attaque'
                fb_first.data=CemeteryWindow.currentStats.attack()
            }
            for (i=0;i<fb_first.data.length;i++){
                fb_first.data[i]=fb_first.data[i].name
            }
            fb_first.fortId=CemeteryWindow.fortId
            fb_second.fortId=0
            new MessageSuccess('Choisissez maintenant une seconde bataille !').show()
        } else {
            if (side=='defense'){
                fb_second.side='défense'
                fb_second.data=CemeteryWindow.currentStats.defense()
            } else {
                fb_second.side='attaque'
                fb_second.data=CemeteryWindow.currentStats.attack()
            }
            for (i=0;i<fb_second.data.length;i++){
                fb_second.data[i]=fb_second.data[i].name
            }
            fb_second.fortId=CemeteryWindow.fortId
            show_results(fb_first.data.diff(fb_second.data),fb_second.data.diff(fb_first.data))
        }
    }
    var send_to = function(players){
        if (players.indexOf(Character.name)!==-1){
            players.remove(players.indexOf(Character.name))
        }
        MessagesWindow.open('telegram',{insert_to:players.join(';')})
    }
    var show_results = function(list1,list2){
        list1.sort()
        list2.sort()
        var window =  $('<div id="twtoolkit_pref"></div>');
        Ajax.remoteCallMode("fort","display",{fortid:fb_first.fortId},function(resp){
            fb_first.fortId=resp.data.name
            Ajax.remoteCallMode("fort","display",{fortid:fb_second.fortId},function(resp){
                fb_second.fortId=resp.data.name
                window.append($('<strong> Joueurs présents en ' + fb_first.side + ' du fort ' + fb_first.fortId + ' mais pas en ' + fb_second.side + ' du fort ' + fb_second.fortId +' : <br/><a id="list1">(Envoyer un message)</a></strong></br></br>'))
                for (i=0;i<list1.length;i++){
                    window.append($('<a href="javascript:PlayerProfileWindow.open(`'+list1[i]+'`)">'+list1[i]+'</a></br>'))
                }
                window.append($('</br></br><strong> Joueurs présents en ' + fb_second.side + ' du fort ' + fb_second.fortId + ' mais pas en ' + fb_first.side + ' du fort ' + fb_first.fortId +' : <br/><a id="list2">(Envoyer un message)</a></strong></br></br>'))
                for (i=0;i<list2.length;i++){
                    window.append($('<a href="javascript:PlayerProfileWindow.open(`'+list2[i]+'`)">'+list2[i]+'</a></br>'))
                }
                window.append($('<p>-------------------------------<br/><a id="listall">Envoyer un message à tous les joueurs de ces listes</a></p>'))
                wman.open('compare', 'Comparaison des joueurs présents').setMiniTitle('Comparaison').appendToContentPane(new west.gui.Scrollpane().appendContent(window).getMainDiv())
                $('#list1').on('click',function(){send_to(list1)})
                $('#list2').on('click',function(){send_to(list2)})
                $('#listall').on('click',function(){send_to(list1.concat(list2))})
            })
        })
    }
   
    })
 },6000)

