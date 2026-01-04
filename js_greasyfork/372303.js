
// ==UserScript==
// @name         MENCY&ERIN
// @name:zh-CN   MENCY&ERIN
// @name:zh-TW   MENCY&ERIN
// @namespace    MENCY
// @version      0.4
// @author       MENCY
// @description  A script to make bb happy
// @description:zh-CN hhhhhh
// @description:zh-TW hhhhhhh
// @license      MIT License
// @resource          up_button_icon https://coding.net/u/mency89/p/test/git/raw/master/duckyon.png
// @resource          down_button_icon https://coding.net/u/mency89/p/test/git/raw/master/duckyoff.png
// @include      http*://*/*
// @grant        GM_openInTab
// @grant        GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/372303/MENCYERIN.user.js
// @updateURL https://update.greasyfork.org/scripts/372303/MENCYERIN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var valentinePhotoUrl="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537252810365&di=ac1f22363c5618201a4a9e4264eeaadf&imgtype=0&src=http%3A%2F%2Fimg1.gtimg.com%2F19%2F1900%2F190053%2F19005391_980x1200_0.jpg";    //新闻图链接
    var valentineWords="bb我好喜欢你哦ヾ(*´∀｀*)ﾉ";    //新闻标题
    var valentinName="Erin";    //情人名字
    var myName="Mency";
    var time="2018 2 16";    //纪念日

    var date=new Date();
    var dateDay=date.getDate(),dateMonth=date.getMonth()+1;
    var html = '';

    //if(/wd=ERIN/.test(location.href)){
        var dayArr=time.split(" ");
        html=`
        <!DOCTYPE html><html><head>
<style>
* {
    box-sizing: border-box;
}
html,
body {
    width: 100%;
    height: 100%;
}
body {
    margin: 0;
    overflow: hidden;
    background: #222;
    font-family: monospace;
}
h1 {
	font-family: "Microsoft Yahei", sans-serif;
    margin-top: 0;
}
button {
	font-family: "Microsoft Yahei", sans-serif;
    border: 2px solid tomato;
    background: transparent;
    width: 250px;
    font-size: 1.2em;
    padding: 10px 0;
    border-radius: 5px;
    display: block;
    margin: 1em auto;
}
article {
	font-family: "Microsoft Yahei", sans-serif;
    width: 80%;
     text-align: center;
    margin: auto;
    font-size: 2em;
    top: 50%;
    position: relative;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}

h2 {
    font-family: "Microsoft Yahei", sans-serif;
    font-size: 4vw;
    text-align: center;
    line-height: 1;
    margin: 0;
    top: 150%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    position: absolute;
    color: #2d2d2d;
    letter-spacing: -.5rem;
}
h2:before {
    content: attr(data-heading);
    position: absolute;
    overflow: hidden;
    color: #ffcc00;
    width: 100%;
    z-index: 5;
    text-shadow: none;
    left: 0%;
    text-align: left;
    -webkit-animation: flicker 3s linear infinite;
    animation: flicker 3s linear infinite;
}
@-webkit-keyframes flicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
        opacity: .99;
        text-shadow: -1px -1px 0 rgba(255, 255, 255, 0.4), 1px -1px 0 rgba(255, 255, 255, 0.4), -1px 1px 0 rgba(255, 255, 255, 0.4), 1px 1px 0 rgba(255, 255, 255, 0.4), 0 -2px 8px, 0 0 2px, 0 0 5px #ff7e00, 0 0 15px #ff4444, 0 0 2px #ff7e00, 0 2px 3px #000;
    }
    20%,
    21.999%,
    63%,
    63.999%,
    65%,
    69.999% {
        opacity: 0.4;
        text-shadow: none;
    }
}
@keyframes flicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
        opacity: .99;
        text-shadow: -1px -1px 0 rgba(255, 255, 255, 0.4), 1px -1px 0 rgba(255, 255, 255, 0.4), -1px 1px 0 rgba(255, 255, 255, 0.4), 1px 1px 0 rgba(255, 255, 255, 0.4), 0 -2px 8px, 0 0 2px, 0 0 5px #ff7e00, 0 0 15px #ff4444, 0 0 2px #ff7e00, 0 2px 3px #000;
    }
    20%,
    21.999%,
    63%,
    63.999%,
    65%,
    69.999% {
        opacity: 0.4;
        text-shadow: none;
    }
}

</style>
</head>
<body>
<script type="text/javascript" src="http://wow.techbrood.com/libs/jquery/jquery-2.1.1.min.js"></script><script src="http://wow.techbrood.com/libs/jquery/jquery-1.11.1.min.js"></script>
<article>
    <h1 id="headline">Love u forever and ever.</h1>
    <p id="text">Erin, I have fallen in love with you for</p>
    <button id="shuffler">Again</button>
    <h2 data-heading="M">Mency.</h2>
</article>
<script>
function WordShuffler(holder, opt) {
    var that = this;
    var time = 0;
    this.now;
    this.then = Date.now();

    this.delta;
    this.currentTimeOffset = 0;

    this.word = null;
    this.currentWord = null;
    this.currentCharacter = 0;
    this.currentWordLength = 0;


    var options = {
        fps: 20,
        timeOffset: 5,
        textColor: '#000',
        fontSize: "50px",
        useCanvas: false,
        mixCapital: false,
        mixSpecialCharacters: false,
        needUpdate: true,
        colors: [
            '#f44336', '#e91e63', '#9c27b0',
            '#673ab7', '#3f51b5', '#2196f3',
            '#03a9f4', '#00bcd4', '#009688',
            '#4caf50', '#8bc34a', '#cddc39',
            '#ffeb3b', '#ffc107', '#ff9800',
            '#ff5722', '#795548', '#9e9e9e',
            '#607d8b'
        ]
    }

    if (typeof opt != "undefined") {
        for (key in opt) {
            options[key] = opt[key];
        }
    }



    this.needUpdate = true;
    this.fps = options.fps;
    this.interval = 1000 / this.fps;
    this.timeOffset = options.timeOffset;
    this.textColor = options.textColor;
    this.fontSize = options.fontSize;
    this.mixCapital = options.mixCapital;
    this.mixSpecialCharacters = options.mixSpecialCharacters;
    this.colors = options.colors;

    this.useCanvas = options.useCanvas;

    this.chars = [
        'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X',
        'Y', 'Z'
    ];
    this.specialCharacters = [
        '!', '§', '$', '%',
        '&', '/', '(', ')',
        '=', '?', '_', '<',
        '>', '^', '°', '*',
        '#', '-', ':', ';', '~'
    ]

    if (this.mixSpecialCharacters) {
        this.chars = this.chars.concat(this.specialCharacters);
    }

    this.getRandomColor = function() {
        var randNum = Math.floor(Math.random() * this.colors.length);
        return this.colors[randNum];
    }

    //if Canvas

    this.position = {
        x: 0,
        y: 50
    }

    //if DOM
    if (typeof holder != "undefined") {
        this.holder = holder;
    }

    if (!this.useCanvas && typeof this.holder == "undefined") {
        console.warn('Holder must be defined in DOM Mode. Use Canvas or define Holder');
    }


    this.getRandCharacter = function(characterToReplace) {
        if (characterToReplace == " ") {
            return ' ';
        }
        var randNum = Math.floor(Math.random() * this.chars.length);
        var lowChoice = -.5 + Math.random();
        var picketCharacter = this.chars[randNum];
        var choosen = picketCharacter.toLowerCase();
        if (this.mixCapital) {
            choosen = lowChoice < 0 ? picketCharacter.toLowerCase() : picketCharacter;
        }
        return choosen;

    }

    this.writeWord = function(word) {
        this.word = word;
        this.currentWord = word.split('');
        this.currentWordLength = this.currentWord.length;

    }

    this.generateSingleCharacter = function(color, character) {
        var span = document.createElement('span');
        span.style.color = color;
        span.innerHTML = character;
        return span;
    }

    this.updateCharacter = function(time) {

        this.now = Date.now();
        this.delta = this.now - this.then;



        if (this.delta > this.interval) {
            this.currentTimeOffset++;

            var word = [];

            if (this.currentTimeOffset === this.timeOffset && this.currentCharacter !== this.currentWordLength) {
                this.currentCharacter++;
                this.currentTimeOffset = 0;
            }
            for (var k = 0; k < this.currentCharacter; k++) {
                word.push(this.currentWord[k]);
            }

            for (var i = 0; i < this.currentWordLength - this.currentCharacter; i++) {
                word.push(this.getRandCharacter(this.currentWord[this.currentCharacter + i]));
            }


            if (that.useCanvas) {
                c.clearRect(0, 0, stage.x * stage.dpr, stage.y * stage.dpr);
                c.font = that.fontSize + " sans-serif";
                var spacing = 0;
                word.forEach(function(w, index) {
                    if (index > that.currentCharacter) {
                        c.fillStyle = that.getRandomColor();
                    } else {
                        c.fillStyle = that.textColor;
                    }
                    c.fillText(w, that.position.x + spacing, that.position.y);
                    spacing += c.measureText(w).width;
                });
            } else {

                if (that.currentCharacter === that.currentWordLength) {
                    that.needUpdate = false;
                }
                this.holder.innerHTML = '';
                word.forEach(function(w, index) {
                    var color = null
                    if (index > that.currentCharacter) {
                        color = that.getRandomColor();
                    } else {
                        color = that.textColor;
                    }
                    that.holder.appendChild(that.generateSingleCharacter(color, w));
                });
            }
            this.then = this.now - (this.delta % this.interval);
        }
    }

    this.restart = function() {
        this.currentCharacter = 0;
        this.needUpdate = true;
    }

    function update(time) {
        time++;
        if (that.needUpdate) {
            that.updateCharacter(time);
        }
        requestAnimationFrame(update);
    }

    this.writeWord(this.holder.innerHTML);


    console.log(this.currentWord);
    update(time);
}

function timeElapse2(c) {
				var e = Date();
				var f = (Date.parse(e) - Date.parse(c)) / 1000;
				days = Math.floor(f / (3600 * 24));
				days = days+"";
		}
var headline = document.getElementById('headline');
var text = document.getElementById('text');

	var together = new Date();
	together.setFullYear(2018, 2, 16);
var days;
var dayss = new timeElapse2(together);
text.innerHTML="Erin, I have fallen in love with you for "+days+" days.";
var shuffler = document.getElementById('shuffler');

var headText = new WordShuffler(headline, {
    textColor: '#fff',
    timeOffset: 4,
    mixCapital: true,
    mixSpecialCharacters: true
});

var pText = new WordShuffler(text, {
    textColor: '#fff',
    timeOffset: 2
});

var buttonText = new WordShuffler(shuffler, {
    textColor: 'tomato',
    timeOffset: 10
});



shuffler.addEventListener('click', function() {
    headText.restart();
    pText.restart();
    buttonText.restart();
});
</script>

</body>
</html>`;
       // GM_openInTab('data:text/html;charset=utf-8,' + encodeURIComponent(html),false);
   // }else{
       //  var listWrapper=document.querySelector(".s-news-list-wrapper");
      //  if(listWrapper){
      //      var valentineItem=document.createElement("div");
      //      valentineItem.className="s-news-special s-news-item s-news-special-item-tpl-2 s-opacity-blank8";
      //      valentineItem.innerHTML=`<div class="s-pic-content"><div class="s-pic-content-own"> <ul class="s-news-content-imgs clearfix"> <li class="item-img-wrap"> <a href="https://www.baidu.com/s?wd=ERIN" target="_blank" title="${valentineWords}"> <img class="s-news-img" src="${valentinePhotoUrl}" height="119" width="179"> </a>   </li></ul></div></div> <div class="s-block-container"> <div class="s-block-container-own"> <div class="s-text-content"> <h2><a href="https://www.baidu.com/s?wd=ERIN" title="${valentineWords}" target="_blank" class="s-title-yahei">${valentineWords}</a><a href="javascript:;" class="del"></a></h2>  </div> <div class="from">  <span class="src-net"> <a href="http://ent.chinadaily.com.cn" target="_blank" data-src="1" data-click="LOG_LINK"> 中国日报网 </a> </span>  <span class="src-time">02-11 15:58</span>  <div class="dustbin" data-click="LOG_BTN_DUSTBIN"></div></div> </div> </div>`;
      //      listWrapper.insertBefore(valentineItem,listWrapper.firstChild);
      //  }
   // }

     var opacityMouseLeave = 1;
     var goTopBottomButton = document.createElement("div");
    goTopBottomButton.className = "goTopBottomButton";
    goTopBottomButton.innerHTML = "<img class='toggleButton' style='width:32px;height:32px;display:block;cursor:pointer;'></img>"; //图片的宽和高可修改，原始图片宽高均为 40px
    goTopBottomButton.style.position = "fixed";
    goTopBottomButton.style.zIndex = 10000;
    goTopBottomButton.style.top = "100px";
    goTopBottomButton.style.left = "30px";
    var toggleButton = goTopBottomButton.lastChild;
    toggleButton.style.opacity = opacityMouseLeave; //按钮初始不透明度
    toggleButton.src = GM_getResourceURL("down_button_icon"); //按钮初始显示向下的图片
    document.getElementsByTagName("body")[0].appendChild(goTopBottomButton);

    /*按钮事件开始*/
    toggleButton.addEventListener("mouseenter",function() {

        toggleButton.src = GM_getResourceURL("up_button_icon");
    })

    toggleButton.addEventListener("mouseleave",function() {
         toggleButton.src = GM_getResourceURL("down_button_icon");
    })

    toggleButton.addEventListener("click",function() {
         GM_openInTab('data:text/html;charset=utf-8,' + encodeURIComponent(html),false);
    })
})();