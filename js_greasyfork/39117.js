// ==UserScript==
// @name         SLG Emoji
// @namespace    http://slizg.eu
// @version      0.4.1
// @description  by kamson. & Miechu
// @match        http://www.slizg.eu/*
// @author       kamson. - http://www.slizg.eu/memberlist.php?mode=viewprofile&u=13702
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39117/SLG%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/39117/SLG%20Emoji.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var el = document.querySelector('form .row2 tr:nth-child(2) td');
    var x = document.getElementsByClassName("postbody");
    var i = 0;
	var emojiList = [
        {code:":belmondziak:", url:"https://i.imgur.com/290Km30.png"},
        {code:":bonusrpk:",    url:"https://i.imgur.com/Xhloclf.png"},
        {code:":borek:", url:"https://i.imgur.com/hIWKJnD.png"},
        {code:":cejro:", url:"https://i.imgur.com/sH9jvLx.png"},
        {code:":dihoraz:", url:"https://i.imgur.com/ahNBENU.png"},
        {code:":diox:", url:"https://i.imgur.com/0pdjU7v.png"},
        {code:":dronik:", url:"https://i.imgur.com/9tJFoCo.png"},
        {code:":duda:", url:"https://i.imgur.com/CQ7IqjP.png"},
        {code:":eldoka:", url:"https://i.imgur.com/wuwlgS0.png"},
        {code:":eldoka2:", url:"https://i.imgur.com/gjaNCOc.png"},
        {code:":ematei:", url:"https://i.imgur.com/oBPZbdC.png"},
        {code:":facecik:", url:"https://i.imgur.com/BFlBMwA.png"},
        {code:":kabaan:", url:"https://i.imgur.com/UIumrK7.png"},
        {code:":keke:", url:"https://i.imgur.com/Fpa0iWb.png"},
        {code:":keke2:", url:"https://i.imgur.com/WC9L4gV.png"},
        {code:":korwin:", url:"https://i.imgur.com/1OS1CZj.png"},
        {code:":laik:", url:"https://i.imgur.com/oEiiHMz.png"},
        {code:":maciek:", url:"https://i.imgur.com/WiwUFph.png"},
        {code:":malik:", url:"https://i.imgur.com/TNZ7rAl.png"},
        {code:":malysz:", url:"https://i.imgur.com/hRkR9rr.png"},
        {code:":max:", url:"https://i.imgur.com/Br65lJk.png"},
        {code:":multi:", url:"https://i.imgur.com/fn6IKNw.png"},
        {code:":peja:", url:"https://i.imgur.com/EhIMIEb.png"},
        {code:":peja2:", url:"https://i.imgur.com/k7Kt6RL.png"},
        {code:":pezet:", url:"https://i.imgur.com/NqmKvYF.png"},
        {code:":popas:", url:"https://i.imgur.com/VAURnsA.png"},
        {code:":quebo:", url:"https://i.imgur.com/URro3zm.png"},
        {code:":rena:", url:"https://i.imgur.com/VmI875L.png"},
        {code:":rogal:", url:"https://i.imgur.com/kbiQJnJ.png"},
        {code:":rogal2:", url:"https://i.imgur.com/zrUxNVB.png"},
        {code:":sentino:", url:"https://i.imgur.com/oI9rzpd.png"},
        {code:":stonoga:", url:"https://i.imgur.com/ktSxkwC.png"},
        {code:":tede:", url:"https://i.imgur.com/RzNPUth.png"},
        {code:":tede2:", url:"https://i.imgur.com/xwVR1fB.png"},
        {code:":vnm:", url:"https://i.imgur.com/U772MwD.png"},
        {code:":wilku:", url:"https://i.imgur.com/xDpg07V.png"},
        {code:":wini:", url:"https://i.imgur.com/XnnNXp1.png"}

    ];

if(el) {

    // create button
    var btn = document.createElement("button");
    btn.id = "emoji-btn";
    btn.className = "btnbbcode";
    btn.innerHTML = "Pokaż emoji";

    // add button to form
    el.appendChild(btn);

    // create list for emoji
    var list = document.createElement("ul");
    list.style.display = 'none';
    list.style.columnCount = "8";


    // create list items with emoji
    for (i = 0; i < emojiList.length; i++) {
        var emoji = document.createElement("li");
        var image = document.createElement("img");
            image.classList.add('emoji-image');
            image.src = emojiList[i].url;
            image.width = 36;
            image.height = 36;
            image.setAttribute('data-emoji', emojiList[i].code);
            emoji.innerHTML = emojiList[i].code;
            emoji.appendChild(image);
            el.appendChild(list);
            list.appendChild(emoji);
    }

    // toggle button
    btn.addEventListener('click', function(e){
        e.preventDefault();
        var isVisible = list.style.display;
        if (isVisible === 'none') {
            list.style.display = "block";
        } else {
            list.style.display = "none";
        }
    });

    copyEmoji();

    console.log("editor isvisible");

} else {

    // if there's no editor
    console.log("editor invisible");

}




// replace emoji code with link
for (i = 0; i < x.length; i++){
	x[i].innerHTML = x[i].innerHTML.replace(/:belmondziak:/g, '<img src="https://i.imgur.com/290Km30.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:bonusrpk:/g, '<img src="https://i.imgur.com/Xhloclf.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:borek:/g, '<img src="https://i.imgur.com/hIWKJnD.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:cejro:/g, '<img src="https://i.imgur.com/sH9jvLx.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:dihoraz:/g, '<img src="https://i.imgur.com/ahNBENU.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:diox:/g, '<img src="https://i.imgur.com/0pdjU7v.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:dronik:/g, '<img src="https://i.imgur.com/9tJFoCo.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:duda:/g, '<img src="https://i.imgur.com/CQ7IqjP.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:eldoka:/g, '<img src="https://i.imgur.com/wuwlgS0.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:eldoka2:/g, '<img src="https://i.imgur.com/gjaNCOc.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:ematei:/g, '<img src="https://i.imgur.com/oBPZbdC.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:facecik:/g, '<img src="https://i.imgur.com/BFlBMwA.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:kabaan:/g, '<img src="https://i.imgur.com/UIumrK7.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:keke:/g, '<img src="https://i.imgur.com/Fpa0iWb.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:keke2:/g, '<img src="https://i.imgur.com/WC9L4gV.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:korwin:/g, '<img src="https://i.imgur.com/1OS1CZj.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:laik:/g, '<img src="https://i.imgur.com/oEiiHMz.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:maciek:/g, '<img src="https://i.imgur.com/WiwUFph.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:malik:/g, '<img src="https://i.imgur.com/TNZ7rAl.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:malysz:/g, '<img src="https://i.imgur.com/hRkR9rr.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:max:/g, '<img src="https://i.imgur.com/Br65lJk.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:multi:/g, '<img src="https://i.imgur.com/fn6IKNw.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:peja:/g, '<img src="https://i.imgur.com/EhIMIEb.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:peja2:/g, '<img src="https://i.imgur.com/k7Kt6RL.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:pezet:/g, '<img src="https://i.imgur.com/NqmKvYF.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:popas:/g, '<img src="https://i.imgur.com/VAURnsA.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:quebo:/g, '<img src="https://i.imgur.com/URro3zm.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:rena:/g, '<img src="https://i.imgur.com/VmI875L.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:rogal:/g, '<img src="https://i.imgur.com/kbiQJnJ.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:rogal2:/g, '<img src="https://i.imgur.com/zrUxNVB.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:sentino:/g, '<img src="https://i.imgur.com/oI9rzpd.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:stonoga:/g, '<img src="https://i.imgur.com/ktSxkwC.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:tede:/g, '<img src="https://i.imgur.com/RzNPUth.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:tede2:/g, '<img src="https://i.imgur.com/xwVR1fB.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:vnm:/g, '<img src="https://i.imgur.com/U772MwD.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:wilku:/g, '<img src="https://i.imgur.com/xDpg07V.png" alt="Obrazek">');
	x[i].innerHTML = x[i].innerHTML.replace(/:wini:/g, '<img src="https://i.imgur.com/XnnNXp1.png" alt="Obrazek">');
}

})();

// copy emoji code
function copyEmoji(){
    var emojiImages = document.getElementsByClassName('emoji-image');
    for(i=0; i< emojiImages.length; i++){
        emojiImages[i].onclick = function(){ 
            var a = this.getAttribute('data-emoji');
            var textArea = document.createElement("textarea");
            textArea.value = a;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
            } catch (err) {
                console.log('Oops, unable to copy');
            }
             document.body.removeChild(textArea);
        }
        
    }
}