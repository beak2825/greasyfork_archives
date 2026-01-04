// ==UserScript==
// @name         WK KanaMatrix
// @namespace    EthanMcCoy
// @version      0.6
// @description  On script enabled mobile phones (touchscreen devices) creates a kana matrix input
// @author       Ethan McCoy
// @include       *://www.wanikani.com/lesson/session*
// @include       *://www.wanikani.com/review/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390719/WK%20KanaMatrix.user.js
// @updateURL https://update.greasyfork.org/scripts/390719/WK%20KanaMatrix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var logEvent = function(eventName, message){
      console.log("%cKM: %c" + eventName + "%c " + message, "background-color:black, color:white", "text-decoration:underline; text-decoration-color:red;", "");
    };


    // Some of these might only be used by constructCSS but some of them are used by other functions
    // All number types are units in pixels
    var buttonBkgColor = "#32323e;";
    var buttonBorderColor = "black";
    var buttonPetalColor = "transparent;";
    var buttonTxtColor = "white;";
    var buttonHt = 50;
    var footerHt = 25;
    var buttonBorderWd = 5;
    var buttonWithBorder = buttonHt + 2 * buttonBorderWd;
    var triangleColor = "#90dae077";
    var petalWd = buttonHt * 0.23;
    var buttonFontSizeMain = buttonHt * (1 - 0.23 * 2);
    var petalTopPos = 2;
    var petalBottomPos = 1;
    var petalRightPos = 3;
    var handakutenLeftM = 45;

    // Define and call function so we can collapse it in the editor
    var constructCSS = function(){
          var kbd_css =
          '#KMwrapper {'+
          '  user-select: none;' + //Might stop the keyboard stealing focus on holding the button, can't replicate on PC so here's hoping.
          '  position: fixed;'+
          '  left: 50%;'+
          '  margin-left: -50%;'+
          '  bottom:0px;'+
          '  pointer-events: none;'+
          '  height: ' + buttonWithBorder + 'px;'+
          '  transition: height 0.5s;'+
          '  width: 100%;'+
          '  z-index: 999999;'+
          '}'+

          '#showBoard {'+
          '  user-select: none;'+
          '  top:0px;'+
          '  z-index:10;'+
          '  position:absolute;'+
          '  background-color: purple;'+
          '  opacity:1;'+
          '  visibility:hidden;'+
          '}'+

          '#kanaBoard {'+
          '  user-select: none;'+
          '  top: ' + (buttonWithBorder) + 'px;'+
          '  position:relative;'+
          '  background-color: ' + buttonBorderColor + ';'+
          '  height: ' + 4 * buttonWithBorder + footerHt + 'px;' +
          '}'+

          '#kanaBoard, #showBoard{'+
          '  width: 100%;'+
          '}'+

          '.groupCore, .changeState{'+
          '  width: calc(25% - 10px);'+
          '  height: ' + buttonHt + 'px;'+
          '  line-height: ' + buttonHt + 'px;'+
          '  border-width: ' + buttonBorderWd + 'px;' +
          '  border-style:solid;'+
          '}'+

          '.showButton{'+
          '  background-color: ' + buttonBkgColor +
          '  color: ' + buttonTxtColor +
          '  width: calc((25% - ' + buttonBorderWd/1.5*2 + 'px) / 1.5);'+
          '  height: ' + (buttonWithBorder/1.5 - buttonBorderWd/1.5*2) + 'px;' +//calc(90px / 1.5);'+
          '  line-height: ' + (buttonWithBorder/1.5 - buttonBorderWd/1.5*2) + 'px;' +//calc(95px / 1.5);'+
          '  border-width: ' + buttonBorderWd/1.5 + 'px;' +
          '  box-shadow: 5px 5px #88888877;'+
          '  border-style:solid;'+
          // Obviously this is a bit ironic, we should probably calculate it in javascript not css
          '  font-size: calc('+buttonFontSizeMain+'px / 1.5);'+

          // Margin calculation is a bit of mystery, should check it to see how it works and if it's accurate
          '  margin: ' + (buttonWithBorder - buttonWithBorder/1.5)/2 + 'px calc((25% - 25% / 1.5) / 2 - ' + buttonBorderWd + 'px / 4);' +
          '}'+

          '#spacebar {'+
          '  height:' + (buttonHt+buttonBorderWd) * 2 +'px;'+
          '  font-size:'+buttonFontSizeMain * 2 +'px;'+
          '  float:right;' +
          '}'+

          '#modify {'+
          '  letter-spacing: normal;'+
          '}'+

          '#modify .buttonComps {' +
          '  font-size:' + buttonFontSizeMain * 2 + 'px;' + //64pt;' +
          '  margin-top:15px;' +
          '  width:100%;' +
          '  text-align:center;' +
          '  white-space: nowrap;' +
          '}' +

          '#modify .buttonComps:nth-child(1) {' + //handakuten
          '  text-align:center;' +
          '  text-indent:10%;' +

          '}' +

          '#backspace {'+
          '  font-size:'+buttonFontSizeMain+'px;'+
          '}'+

          '#enter {'+
          '  font-size:'+buttonFontSizeMain*2+'px;'+
          '}'+

          '.showPetal.leftPetal, .showPetal.rightPetal {'+
          //'  line-height: calc(95px / 1.5);'+
          '}'+

          '.showPetal.topPetal{'+
          //'  line-height: calc(25px / 1.5);'+
          '}'+

          '.showPetal.bottomPetal{'+
          '  line-height: calc(17px / 1.5);'+
          '}'+

          '.showPetal{'+
          '  color: ' + buttonTxtColor +
          '  font-size: calc(13pt / 1.5) !important;'+
          '}'+

          '.groupCore, .showButton {'+
          '  position:relative;'+
          '  overflow:hidden;'+
          '  text-align:center;'+
          '  vertical-align:middle;'+
          '  display:inline-block;'+
          '}'+

          '.groupCore {'+
          '  z-index:0;'+
          '  border-color:' + buttonBorderColor + ';'+
          '  background-color: ' + buttonBkgColor +
          '  color: ' + buttonTxtColor +
          '  font-size:'+buttonFontSizeMain+'px;'+
          '}'+

          '.changeState {'+
          '  font-size: ' + buttonFontSizeMain + 'px;' +
          '  border-color:black;'+
          '  background-color: ' + buttonBkgColor +
          '  color: ' + buttonTxtColor +
          '  display: block;'+
          '  vertical-align:top;'+
          '  display:inline-block;'+
          '  position:relative;'+
          '}'+

          '.buttonComps {'+
          '  position:absolute;'+
          '  left:50%;'+
          '  transform: translateX(-50%);'+
          '}'+

          '.groupFlower {'+
          '  pointer-events: none;'+
          '}'+

          '.groupPetal {'+
          '  pointer-events: none;'+
          '  z-index:5;'+
          '  position:absolute;'+
          '  background-color: ' + buttonPetalColor +
          '  font-size: ' + petalWd + 'px;' + //23%;'+//13pt;'+
          '}'+

          '.topPetal {'+
          '  line-height: ' + petalWd + 'px;' + //23%;'+
          '  top: ' + petalTopPos + 'px;'+
          '  height: ' + petalWd + 'px;' + //23%;'+
          '  width: 100%;'+
          '}'+

          '.leftPetal {'+
          //'  line-height: ' + buttonHt + 'px;' +
          '  top:0;'+
          '  left:0;'+
          '  height: 100%;'+
          '  width: 23%;' + //petalWd + 'px;' + // 23%;'+
          '}'+

          '.rightPetal {'+
          //'  line-height: ' + buttonHt + 'px;' +
          '  top:0;'+
          '  right:' + petalRightPos + 'px;'+
          '  height: 100%;'+
          '  width: 23%;' + //petalWd + 'px;' + // 23%;'+
          '}'+

          '.bottomPetal {'+
          '  line-height: ' + petalWd + 'px;' + // 23%;'+
          '  bottom: ' + petalBottomPos + 'px;'+
          '  height: ' + petalWd + 'px;' + // 23%;'+
          '  width: 100%;'+
          '}'+

          '.arrow{'+
          '  pointer-events: none;'+
          '  width: 0; '+
          '  height: 0; '+
          '  position:absolute;'+
          '  z-index:10;'+
          '  visibility:hidden;'+
          '}'+

          '.arrow-up {'+
          '  pointer-events: none;'+
          '  bottom:0;'+

          '  border-bottom: ' + buttonHt/2 + 'px solid ' + triangleColor + ';' +
          '}'+

          '.arrow-down {'+
          '  top:0;'+

          '  border-top: ' + buttonHt/2 + 'px solid ' + triangleColor + ';' +
          '}'+

          '.arrow-right {'+
          '  top:0;'+

          '  border-top: ' + buttonHt/2 + 'px solid transparent;' +
          '  border-bottom: ' + buttonHt/2 + 'px solid transparent;' +
          '}'+

          '.arrow-left {'+
          '  top:0;'+
          '  right:0;'+

          '  border-top: ' + buttonHt/2 + 'px solid transparent;' +
          '  border-bottom: ' + buttonHt/2 + 'px solid transparent;' +
          '}'+

          '#caret {'+
          '  opacity:1;shape-rendering: crispEdges;'+
          '}'+
          'svg {'+
          '  animation: 1s linear 0s infinite running blink;'+
          '}'+

          '@keyframes blink {'+
          '  50% {'+
          '    stroke:black;'+
          '    visibility: visible;'+
          '  }'+
          '  100% {'+
          '    visibility:hidden;'+
          '  }'+
          '}';
      return kbd_css;
  };

    // Define and call function so we can collapse it in the editor and refactor to build dynamically later
    var constructHTML = function(){
        var kbd_html =
            '<div id="KMwrapper">'+
            '   <div id="showBoard">'+
            '      <div class="showButton" id="showA">'+
            '        <div class="groupFlower">'+
            '          <div class="groupPetal topPetal showPetal">う</div>'+
            '          <div class="groupPetal leftPetal showPetal">い</div>'+
            '          <div class="groupPetal rightPetal showPetal">え</div>'+
            '          <div class="groupPetal bottomPetal showPetal">お</div>'+
            '          あ'+
            '        </div>'+
            '    </div><div class="showButton" id="showKA">'+
            '      <div class="groupFlower">'+
            '        <div class="groupPetal topPetal">く</div>'+
            '        <div class="groupPetal leftPetal">き</div>'+
            '        <div class="groupPetal rightPetal">け</div>'+
            '        <div class="groupPetal bottomPetal">こ</div>'+
            '        か'+
            '      </div>'+
            '    </div><div class="showButton" id="showSA">'+
            '      <div class="groupFlower">'+
            '        <div class="groupPetal topPetal">す</div>'+
            '        <div class="groupPetal leftPetal">し</div>'+
            '        <div class="groupPetal rightPetal">せ</div>'+
            '        <div class="groupPetal bottomPetal">そ</div>'+
            '        さ'+
            '      </div>'+
            '    </div><div class="showButton">'+
            '    </div><div class="showButton" id="showTA">'+
            '    <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">つ</div>'+
            '      <div class="groupPetal leftPetal">ち</div>'+
            '      <div class="groupPetal rightPetal">て</div>'+
            '      <div class="groupPetal bottomPetal">と</div>'+
            '      た'+
            '      </div>'+
            '    </div><div class="showButton" id="showNA">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">ぬ</div>'+
            '      <div class="groupPetal leftPetal">に</div>'+
            '      <div class="groupPetal rightPetal">ね</div>'+
            '      <div class="groupPetal bottomPetal">の</div>'+
            '      な'+
            '      </div>'+
            '    </div><div class="showButton" id="showHA">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">ふ</div>'+
            '      <div class="groupPetal leftPetal">ひ</div>'+
            '      <div class="groupPetal rightPetal">へ</div>'+
            '      <div class="groupPetal bottomPetal">ほ</div>'+
            '      は'+
            '      </div>'+
            '    </div><div class="showButton">'+
            '    </div><div class="showButton" id="showMA">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">む</div>'+
            '      <div class="groupPetal leftPetal">み</div>'+
            '      <div class="groupPetal rightPetal">め</div>'+
            '      <div class="groupPetal bottomPetal">も</div>'+
            '      ま'+
            '      </div>'+
            '    </div><div class="showButton" id="showYA">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">ゆ</div>'+
            '      <div class="groupPetal leftPetal">（</div>'+
            '      <div class="groupPetal rightPetal">）</div>'+
            '      <div class="groupPetal bottomPetal">よ</div>'+
            '      や'+
            '      </div>'+
            '    </div><div class="showButton" id="showRA">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">る</div>'+
            '      <div class="groupPetal leftPetal">り</div>'+
            '      <div class="groupPetal rightPetal">れ</div>'+
            '      <div class="groupPetal bottomPetal">ろ</div>'+
            '      ら'+
            '      </div>'+
            '    </div><div class="showButton">'+
            '    </div><div class="showButton">'+
            '    </div><div class="showButton" id="showWA">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">ん</div>'+
            '      <div class="groupPetal leftPetal">を</div>'+
            '      <div class="groupPetal rightPetal">ー</div>'+
            '      <div class="groupPetal bottomPetal">～</div>'+
            '      わ'+
            '      </div>'+
            '    </div><div class="showButton" id="showPUNC">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">？</div>'+
            '      <div class="groupPetal leftPetal">。</div>'+
            '      <div class="groupPetal rightPetal">！</div>'+
            '      <div class="groupPetal bottomPetal">…</div>'+
            '      、'+
            '      </div>'+
            '    </div>'+
            '  </div>'+
            '  <div id="kanaBoard">'+
            '    <div class="groupCore" id="a">'+
            '      <div class="groupFlower">'+
            '        <div class="groupPetal topPetal">う</div>'+
            '        <div class="groupPetal leftPetal">い</div>'+
            '        <div class="groupPetal rightPetal">え</div>'+
            '        <div class="groupPetal bottomPetal">お</div>'+
            '        あ'+
            '      </div>'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '    </div><div class="groupCore" id="ka">'+
            '      <div class="groupFlower">'+
            '        <div class="groupPetal topPetal">く</div>'+
            '        <div class="groupPetal leftPetal">き</div>'+
            '        <div class="groupPetal rightPetal">け</div>'+
            '        <div class="groupPetal bottomPetal">こ</div>'+
            '        か'+
            '      </div>'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '    </div><div class="groupCore" id="sa">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">す</div>'+
            '      <div class="groupPetal leftPetal">し</div>'+
            '      <div class="groupPetal rightPetal">せ</div>'+
            '      <div class="groupPetal bottomPetal">そ</div>'+
            '      さ'+
            '      </div>'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '    </div><div class="changeState" id="backspace">'+
            '      <span class="buttonComps">⌫'+
            '      </span>'+
            '    </div><div class="groupCore" id="ta">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">つ</div>'+
            '      <div class="groupPetal leftPetal">ち</div>'+
            '      <div class="groupPetal rightPetal">て</div>'+
            '      <div class="groupPetal bottomPetal">と</div>'+
            '      た'+
            '      </div>'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '    </div><div class="groupCore" id="na">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">ぬ</div>'+
            '      <div class="groupPetal leftPetal">に</div>'+
            '      <div class="groupPetal rightPetal">ね</div>'+
            '      <div class="groupPetal bottomPetal">の</div>'+
            '      な'+
            '      </div>'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '    </div><div class="groupCore" id="ha">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">ふ</div>'+
            '      <div class="groupPetal leftPetal">ひ</div>'+
            '      <div class="groupPetal rightPetal">へ</div>'+
            '      <div class="groupPetal bottomPetal">ほ</div>'+
            '      は'+
            '      </div>'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '    </div><div class="changeState" id="spacebar">'+
            '      <span class="buttonComps">⎵'+
            '      </span>'+
            '    </div><div class="groupCore" id="ma">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">む</div>'+
            '      <div class="groupPetal leftPetal">み</div>'+
            '      <div class="groupPetal rightPetal">め</div>'+
            '      <div class="groupPetal bottomPetal">も</div>'+
            '      ま'+
            '      </div>'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '    </div><div class="groupCore" id="ya">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">ゆ</div>'+
            '      <div class="groupPetal leftPetal">（</div>'+
            '      <div class="groupPetal rightPetal">）</div>'+
            '      <div class="groupPetal bottomPetal">よ</div>'+
            '      や'+
            '      </div>'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '    </div><div class="groupCore" id="ra">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">る</div>'+
            '      <div class="groupPetal leftPetal">り</div>'+
            '      <div class="groupPetal rightPetal">れ</div>'+
            '      <div class="groupPetal bottomPetal">ろ</div>'+
            '      ら'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '      </div>'+
            '    </div>'+
            '    <div class="changeState" id="modify">'+
            '      <span class="buttonComps">ﾞ ﾟ</span>'+
            //'      <span class="buttonComps"></span>'+
            '      <span class="buttonComps" style="font-size:16pt;margin-top:15px">大&#8660;小</span>'+
            '    </div><div class="groupCore" id="wa">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">ん</div>'+
            '      <div class="groupPetal leftPetal">を</div>'+
            '      <div class="groupPetal rightPetal">ー</div>'+
            '      <div class="groupPetal bottomPetal">～</div>'+
            '      わ'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '      </div>'+
            '    </div><div class="groupCore" id="punc">'+
            '      <div class="groupFlower">'+
            '      <div class="groupPetal topPetal">？</div>'+
            '      <div class="groupPetal leftPetal">。</div>'+
            '      <div class="groupPetal rightPetal">！</div>'+
            '      <div class="groupPetal bottomPetal">…</div>'+
            '      、'+
            '      <div class="arrow arrow-down"></div>'+
            '      <div class="arrow arrow-right"></div>'+
            '      <div class="arrow arrow-left"></div>'+
            '      <div class="arrow arrow-up"></div>'+
            '      </div>'+
            '    </div><div class="changeState" id="enter">'+
            '      <span class="buttonComps">⏎'+
            '      </span>'+
            '    </div>'+
            '    '+
            '  </div>'+
            '</div>';
        return kbd_html;
    };

    // Assign global variable initial values
    var curItemKey = "currentItem";
    var qTypeKey = "questionType";
    var actQueueKey = "activeQueue";
    var svgXmlNs = "http://www.w3.org/2000/svg";
    var usrDiv = document.createElement("div");
    var svgD = document.createElementNS(svgXmlNs, "svg");
    svgD.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    var caret = document.createElementNS(svgXmlNs, "line");
    // These are not CSS values, they are svg display instructions
    caret.setAttribute("id", "caret");
    caret.setAttribute("x1", "2");
    caret.setAttribute("x2", "2");
    caret.setAttribute("y1", "9");  // This may depend on the screen and input size, so should be defined later
    caret.setAttribute("y2", "27"); // ditto ^
    caret.setAttribute("stroke-width", "1");
    svgD.appendChild(caret);

    var answerCopySpan = document.createElement("span");
    // This is a CSS value, should maybe assign in CSS declaration?
    answerCopySpan.style.visibility = "hidden";

    var updateValue = function(e) {
        logEvent(e.type, "updateValue on e.target");
        answerCopySpan.innerText = e.target.value;
    };

    var enableKbd = function(){
        console.log("enableKbd %cArguments","color: purple", arguments);


        var usr = $("#user-response");
        usr[0].style.caretColor = "transparent";
        var fld = usr.parent();

        // Div that covers the answer field and steals focus so the navtive mobile keyboard pisses off.
        //usrDiv.focus();
        usrDiv.style.position = "absolute";
        usrDiv.style.opacity = 1;

        // From @media section of input css so may need dynamic adjustment
        usrDiv.style.fontSize = "0.75em";

        usrDiv.style.textAlign = "center";

        usrDiv.style.backgroundColor="transparent";
        //        usrDiv.style.pointerEvents="none";
        usrDiv.style.outline = "none";
        fld.prepend(usrDiv);

        svgD.setAttribute("width", "3");

        //Put span in the div so our fake caret will be around the right spot (after the text)
        answerCopySpan.innerText = usr.val();

        usrDiv.appendChild(answerCopySpan);

        console.log("appending", svgD);
        usrDiv.appendChild(svgD);
    };

    var groupings = {
        a:"あいうえお",
        ka:"かきくけこ",
        sa:"さしすせそ",
        ta:"たちつてと",
        na:"なにぬねの",
        ha:"はひふへほ",
        ma:"まみむめも",
        ya:"や（ゆ）よ",
        ra:"らりるれろ",
        wa:"わをんー～",
        punc:"、。？！…"
    };
    var makeDiv = function(cl, id, text){
        var result = document.createElement("div");
        if (cl){
            result.className = cl;
        }
        if (id){
            result.id = id;
        }
        if (text){
            result.appendChild(document.createTextNode(text));
        }
        return result;
    };

    var createNodeFromGrouping = function(v, i, a){
        var result;
        if (i === 0){
            //a - centre value: needs all the nodes
            result = makeDiv("groupFlower", false, a[0]);
            result.appendChild(makeDiv("groupPetal leftPetal showPetal", false, a[1]));
            result.appendChild(makeDiv("groupPetal topPetal showPetal", false, a[2]));
            result.appendChild(makeDiv("groupPetal rightPetal showPetal", false, a[3]));
            result.appendChild(makeDiv("groupPetal bottomPetal showPetal", false, a[4]));
        }
        else{
            result = document.createTextNode(v);
        }
        return result;
    };

    var buttonNodes = {};
    var fillButtonNodes = function(buttonNodes){
        for (var grouping in groupings){
            var aiueoString = groupings[grouping];
            // eg. buttonNodes["ka"] = [groupFlowerDiv, leftPetalDiv, topPetalDiv, rightPetalDiv, bottomPetalDiv]
            buttonNodes[grouping] = Array.prototype.map.call(aiueoString, createNodeFromGrouping);
        }
        console.log("buttonNodes", buttonNodes);
    };
    // Just fills the object, which should be passed by reference so doesn't need to be reassigned
    fillButtonNodes(buttonNodes);

    var direction;
    var mouseDownCoords = [];
    var activeButton;
    var showButton;
    var clearArrowsBut = function(activeButton/** DivElement */, expt /** String */){
        activeButton
            .getElementsByClassName("arrow-up")[0].style.visibility=(expt==="arrow-up"?"visible":"hidden");
        activeButton
            .getElementsByClassName("arrow-left")[0].style.visibility=(expt==="arrow-left"?"visible":"hidden");
        activeButton
            .getElementsByClassName("arrow-right")[0].style.visibility=(expt==="arrow-right"?"visible":"hidden");
        activeButton
            .getElementsByClassName("arrow-down")[0].style.visibility=(expt==="arrow-down"?"visible":"hidden");
        return activeButton;
    };
    var repaintDisplay = function(showButton, direction){
        console.log("%crunning repaintDisplay", "color:red", arguments);
        if (showButton){
            while (showButton.childNodes[0]){
                showButton.removeChild(showButton.childNodes[0]);
            }
            if (buttonNodes[activeButton.id]){
                var noneNode = buttonNodes[activeButton.id][0];

                // Expected to only have one node in each petal.
                var upNode = buttonNodes[activeButton.id][2];
                var leftNode = buttonNodes[activeButton.id][1];
                var rightNode = buttonNodes[activeButton.id][3];
                var downNode = buttonNodes[activeButton.id][4];

                switch (direction){
                    case "up":
                        // Clear other arrow visibilities
                        clearArrowsBut(activeButton, "arrow-down");

                        showButton.appendChild(upNode);
                        break;
                    case "left":
                        //Clear other arrow visibilities
                        clearArrowsBut(activeButton, "arrow-right");

                        showButton.appendChild(leftNode);
                        break;
                    case "right":
                        //Clear other arrow visibilities
                        clearArrowsBut(activeButton, "arrow-left");

                        showButton.appendChild(rightNode);
                        break;
                    case "down":
                        //Clear other arrow visibilities
                        clearArrowsBut(activeButton, "arrow-up");

                        showButton.appendChild(downNode);
                        break;
                    default:
                        // Clear all triangles
                        clearArrowsBut(activeButton);
                        // Show default button
                        showButton.appendChild(noneNode);
                        break;
                }
            }
        }
    };

    /** globalMouseMoveHandler
Should only be active while mouse button is down (dragging)
@todo convert to touchevents
@param {MouseEvent} e - the native mousemove event
*/
    var globalMouseMoveHandler = function(e){
        logEvent(e.type, "globalMouseMoveHandler on " + e.target);
        var threshold = 30; //number of pixels before it's not the centre
        console.log("%cactiveButton.id", "color:green", activeButton.id);
        var pairId = "show"+activeButton.id.toUpperCase();
        showButton = document.getElementById(pairId);
        console.log(pairId, showButton);
        if (mouseDownCoords.length){
            var horizontalD = (e.clientX||e.touches[0].pageX)-mouseDownCoords[0];
            var verticalD = (e.clientY||e.touches[0].pageY)-mouseDownCoords[1];
            if (horizontalD > Math.max(threshold, Math.abs(verticalD))){
                direction = "right";
            }
            else if (horizontalD < Math.min(-threshold, -Math.abs(verticalD))){
                direction = "left";
            }
            else if (verticalD > Math.max(threshold, Math.abs(horizontalD))){
                direction = "down";
            }
            else if (verticalD < Math.min(-threshold, -Math.abs(horizontalD))){
                direction = "up";
            }
            else{
                direction = "none";
            }
            repaintDisplay(showButton, direction);
            // reset direction
            //direction = "none";
        }
        //console.log("mousemove doc", e);
    };

    var setUpMoveTracker = function(){
        //document.addEventListener("mousemove", globalMouseMoveHandler);
        document.addEventListener("touchmove", globalMouseMoveHandler);
    };

    var outputField = document.getElementById("user-response");

    var getOutput = function(outputField){
        return outputField.value;
    };
    var setOutput = function(val, outputField){
        console.log("setting", val);
        if (!outputField.disabled){
            outputField.value = val;
            answerCopySpan.innerText = outputField.value;
        }
    };
    var modifyOutput = function(val, outputField){
        if (!outputField.disabled){
            outputField.value += val;
            answerCopySpan.innerText = outputField.value;
        }
    };

    var listenForMouseUp = function(){
        var onMouseUp = function(e){
            logEvent(e.type, "onMouseUp on "+e.target);
            //Get the elements showBoard pair
            var pairId = "show"+activeButton.id.toUpperCase();
            //Hide the button on showBoard
            document.getElementById(pairId).style.visibility="hidden";
            //Hide arrows
            clearArrowsBut(activeButton);
            // Remove globalMovementListener
            //document.removeEventListener("mousemove", globalMouseMoveHandler);
            document.removeEventListener("touchmove", globalMouseMoveHandler);

            // Remove self from listeners
            // using 'once' option for this purpose

            // Output chosen character to text
            // Get direction string position at release
            var dirId = 0;
            switch (direction){
                case "left":  dirId = 1; break;
                case "up":    dirId = 2; break;
                case "right": dirId = 3; break;
                case "down":  dirId = 4; break;
            }
            if (groupings[activeButton.id]){
                var val = groupings[activeButton.id][dirId];
                modifyOutput(val, outputField);
            }

            // Drags are okay but MouseClicks (that fire with the touch events) cause blur event to fire, this line prevents that.
            e.preventDefault();
        };
        document.addEventListener("touchend", onMouseUp, {
            once:true
        });
    };

    var initTouchEvent = function(elem){
        var onMouseDown = function(e){
          logEvent(e.type, "onMouseDown handler on "+e.target);
//          e.preventDefault();
          direction = "none";
          activeButton = e.target;
          //Get the elements showBoard pair
          var pairId = "show"+activeButton.id.toUpperCase();
          //Show the button on showBoard
          var showButton = document.getElementById(pairId);
          if (showButton){
              showButton.style.visibility="visible";
              repaintDisplay(showButton, direction);
              //Store coordinates of click
              mouseDownCoords = [e.clientX||e.touches[0].pageX, e.clientY||e.touches[0].pageY];
              setUpMoveTracker();//mousemove
              listenForMouseUp();//mouseup
          }
        };
        elem.addEventListener("touchstart", onMouseDown);
    };

    /** Performs a character rotation for Kana
*/
    var rotateChar = function(char){
        var lookup = [
            "あいうえおかきくけこさしすせそたちつてとはひふへほばびぶべぼやゆよわぁぃぅぇぉがぎぐげござじずぜぞだぢっづでどぱぴぷぺぽゃゅょゎ",
            "ぁぃぅぇぉがぎぐげござじずぜぞだぢっでどばびぶべぼぱぴぷぺぽゃゅょゎあいうえおかきくけこさしすせそたちづつてとはひふへほやゆよわ"
        ];
        console.log(lookup);
        return lookup[1][lookup[0].indexOf(char)]||char;
    };

    //$(document).ready(function(){
    // loadingScreen.remove is called after page is rendered, so sizes should be set by then
    // It is also called when a new question is up, although there is nothing to remove, so we probably don't want to run it the other times
    var runCounter = 0;

    var kanaMxKbd = {
        // Initial status
        status: "hidden",

        // Add relevant html and css on page load
        inject: function(){
            console.log("%cKM: %cInjecting Code into DOM", "color:white; background-color: black", "color:red; background-color: black");
            $("#reviews").append(constructHTML());
            enableKbd();

            var oldEvaluate = answerChecker.evaluate;
            // TODO Mutation observers
            answerChecker.evaluate = function(){
              logEvent("answerEvaluate", "Important 'event', but currently shimming when we should probably mutationObserve");
                var result = oldEvaluate.apply(answerChecker, arguments);

                // Answer submitted, so the field should be disabled (but might not be set yet?)

                if (!result.exception && true||$("#user-response")[0].disabled){
                    console.log("%cAnswer Submitted (reviews)", "background-color:pink");
                    kanaMxKbd.disableKanaMatrixOnly();
                }
                return result;
            };

            // Observe input field
            var inputObserver = new MutationObserver(function(mutationsList, observer){
                console.log("%cDOM ready for measurement", "background-color:pink");
                observer.disconnect();
                kanaMxKbd.resize();
            });
            inputObserver.observe($("#user-response")[0], {attributes:true});
        },
        // Measure elements and resize divs
        resize: function(){
            console.log("%cKM: %cMeasuring widths and resizing element components", "color:white; background-color: black", "color:orange; background-color: black");
            var usrDivwidth = $("#user-response")[0].scrollWidth;
            var usrDivheight = $("#user-response")[0].scrollHeight;
            console.log("%cKM: %cResize div cover: " + usrDivwidth + "px x " + usrDivheight + "px", "color:white; background-color: black", "color:orange;");

            usrDiv.style.width = usrDivwidth+"px";
            usrDiv.style.height = usrDivheight+"px";

            svgD.setAttribute("height", usrDivheight);
            svgD.setAttribute( "viewBox", "0 0 3 " + usrDivheight);

            // Resize the triangles to a percentage of the document width
            $(".arrow").each(setTriangleWidths);

            //this.contextEnable();
        },

        // Enable keyboard (question is a reading)
        enable: function(){
            console.log("%cKM: %cShowing and activating the KanaMatrix", "color:white; background-color: black", "color:yellow; background-color: black");
            if ($("#user-response")[0]){
                // Hide the native text caret by making it transparent
                $("#user-response")[0].style.caretColor = "transparent";
                // Remove answerfield from tabIndex
                $("#user-response")[0].setAttribute("tabIndex", -1);
            }
            // Add usrDiv (covering answerfield) to tabIndex
            usrDiv.setAttribute("tabIndex", 0);
            // enable pointerevents
            usrDiv.style.pointerEvents = "";

            // Give usrDiv focus to hide native kbd
            usrDiv.focus();
            // show kanamatrix
            this.show();

        },

        // Answer submitted, don't want any field enabled
        disableKanaMatrixOnly: function(){
            console.log("%cKM: %cDisabling the KanaMatrix, but not hiding it", "color:white; background-color: black", "color:lightgreen; background-color: black");
            kanaMxKbd.hideCaret();
            usrDiv.setAttribute("tabIndex", -1);
            usrDiv.style.pointerEvents = "none";
        },

        // Disable keyboard (question is a meaning)
        disable: function(){
            console.log("%cKM: %cHiding the KanaMatrix", "color:white; background-color: black", "color:lightblue; background-color: black");

            if ($("#user-response")[0]){
                //Show the native text caret by clearing caretColor
                $("#user-response")[0].style.caretColor = "";//so I know it works
                // Remove usrDiv from tabIndex
                usrDiv.setAttribute("tabIndex", -1);
                // Ignore pointerevents
                usrDiv.style.pointerEvents = "none";
                // Add answerfield back to tabIndex
                $("#user-response")[0].setAttribute("tabIndex", 0);
                // Give answerfield focus
                $("#user-response")[0].focus();
            }
            //Hide the kanaBoard
            this.hide();

        },
        // Enable or disable based on questionType
        contextEnable: function(e){ // String from jStorage indicates what key was changed
            console.log("%cKM: %cChecking circumstances to determine which action to take", "color:white; background-color: black", "color:violet; background-color: black");

            if ($("#user-response")[0].disabled && e !== curItemKey){ // init was called when an answer has been submitted, probably resized window
                console.log("%cCould have been called after a resize, or when questionType changes on lessons: ", "color:darkblue", e);
                this.disableKanaMatrixOnly();
            }
            else if ($.jStorage.get(qTypeKey)==="reading"){
                this.enable();
            }
            else{
                this.disable();
            }
        },
        // Reveal keyboard through animation
        show: function(){

            this.status = "shown";
            this.showCaret();
            // Named function so it is easy to remove
            var transitionCnclFn = function(e){
                logEvent(e.type, "transitionCnclFn on "+e.target);
            };

            if ($("#KMwrapper")[0]){
                $("#KMwrapper")[0].style.height = (5 * buttonWithBorder + footerHt) + "px";

                // Does nothing, but still should remove when we know whats going on, even with the 'once' setting, it may get added more often than it is executed and removed
                $("#KMwrapper")[0].addEventListener("transitioncancel", transitionCnclFn, {
                    'once':true
                });
                $("#KMwrapper")[0].addEventListener("transitionend", function(e){
                    logEvent(e.type, "anonymous function on "+e.target);
                    $("#KMwrapper")[0].removeEventListener("transitioncancel", transitionCnclFn);
                }, {
                    'once':true
                });
            }
        },
        // Hide keyboard through animation
        hide: function(){
            this.status = "hidden";
            this.hideCaret();
            if ($("#KMwrapper")[0]){
              $("#KMwrapper")[0].style.height = buttonWithBorder + "px";
            }
        },
        showCaret: function(){
            caret.style.visibility = "";
        },
        hideCaret: function(){
            caret.style.visibility = "hidden";
        }
    };


    var main = function(e){
        logEvent(e.type, "main on "+e.target);

      console.log("%cKM: %cmain%c - run once and only once when the quiz is about to start.", "background-color:black; color:white;", "text-decoration:underline", "");
        runCounter++;
        // Inject only once per page load
        if (runCounter === 1){
          // Stop mousedowns from blurring the field when we want to keep kanaMatrix up.
          document.body.addEventListener("mousedown", function(e){
            logEvent(e.type, "anonymous function on "+e.target + ". Aimed at stopping the blur event on the inputfield when the usrDiv is clicked, or the key held down too long. WIP");
            //e.preventDefault();
          });

              kanaMxKbd.inject();


            //Assign listeners
            $("#user-response")[0].addEventListener('input', updateValue);

            var kanaBoard = document.getElementById("kanaBoard");
            kanaBoard.addEventListener("touchmove", function(e){
                logEvent(e.type, "anonymous function on "+e.target);
                e.preventDefault();
            }, false);

            var kanaButtons = kanaBoard.getElementsByClassName("groupCore");
            for (var key in kanaButtons) if (kanaButtons.hasOwnProperty(key)){
                initTouchEvent(kanaButtons[key]);
            }

            var kanaModifyButtonHandler = function(e){
                logEvent(e.type, "kanaModifyButtonHandler on "+e.target);
                //Get current output (last character)
                var output = getOutput(outputField);
                var lastChar = output[output.length-1];
                if(lastChar){
                    output = output.substr(0,output.length-1)+rotateChar(lastChar);
                    setOutput(output, outputField);
                }
                // prevent event from blurring usrDiv
                e.preventDefault();
            };
            document.getElementById("modify").addEventListener("touchstart", kanaModifyButtonHandler);

            var backspaceButtonHandler = function(e){
                logEvent(e.type, "backspaceButtonHandler on "+e.target);
                //Get current output (last character)
                var output = getOutput(outputField);
                var lastChar = output[output.length-1];
                if(lastChar){
                    output = output.substr(0,output.length-1);
                    setOutput(output, outputField);
                }
                // prevent event from blurring usrDiv
                e.preventDefault();
            };
            document.getElementById("backspace").addEventListener("touchstart", backspaceButtonHandler);

            var spaceBarHandler = function(e){
                logEvent(e.type, "spaceBarHandler on "+e.target);
                //Get current output (last character)
                var output = getOutput(outputField);
                var lastChar = output[output.length-1];
                if(lastChar){
                    output += "　"; //Japanese space char, I don't think it will be used though
                    setOutput(output, outputField);
                }
                // prevent event from blurring usrDiv
                e.preventDefault();
            };
            document.getElementById("spacebar").addEventListener("touchstart", spaceBarHandler);

            var enterHandler = function(e){
                logEvent(e.type, "enterHandler on "+e.target);
                e.preventDefault();
                return $("#answer-form button").click();
            };
            document.getElementById("enter").addEventListener("touchstart", enterHandler);

            // Disable matrix while in transition
            $("#KMwrapper")[0].addEventListener("transitionstart", function(){
                logEvent(e.type, "anonymous function on "+e.target);
                $("#kanaBoard")[0].style.pointerEvents = "none";
            });
            // Enable matrix when in place
            $("#KMwrapper")[0].addEventListener("transitionend", function(){
                logEvent(e.type, "anonymous function on "+e.target);
                $("#kanaBoard")[0].style.pointerEvents = "auto";
            });
        }
        else{
            console.log("%cKM: Already initialized, this function has been called " + runCounter + " time(s)", "color:grey");
        }
    };

    // Commands that require the DOM to be active
    var init = function(){
        $("head").append("<style>"+constructCSS()+"</style>");

        var lessonOrReview = ($("#reviews").length?"r":$("#lessons").length?"l":false);

        if (lessonOrReview === "r"){
          // $.jStorage.listenKeyChange("questionType") fires before document.readyState is "complete" in reviews
          // Code is therefore not injected yet.
            if (document.readyState === 'complete')
                main({type:"invoked by code (reviews)"});
            else
                window.addEventListener('load', main, false);

        }
        else if (lessonOrReview === "l"){
            $("#lessons").append(constructHTML());
            curItemKey ="l/currentQuizItem";
            qTypeKey ="l/"+qTypeKey;
            actQueueKey = "l/"+actQueueKey;
            $.jStorage.listenKeyChange(curItemKey, function(e, a){
                console.log("KM: initiating, because "+e+ " has just been "+ a);
                main({type:"invoked by code (lessons)"});
            });
        }

    };
    init();




    // Borders don't accept percentages so we need to calculate he pixel width of the buttons ourselves
    var setTriangleWidths = function(ix, triElem){
        var docWidth = window.document.body.clientWidth;
        var numButtons = 4;
        var triangleWidth = (docWidth - numButtons * buttonBorderWd * 2) / numButtons / 2;
        triElem.style.borderLeft = triangleWidth + "px solid " + ($(triElem).hasClass("arrow-right")? triangleColor : "transparent");
        triElem.style.borderRight = triangleWidth + "px solid " + ($(triElem).hasClass("arrow-left")? triangleColor : "transparent");
        return triElem;
    };


    //**** Listeners ****//
    // Did the answer field get focus?
    usrDiv.addEventListener("focus", function(e){
        logEvent(e.type, "anonymous function on "+e.target);
        kanaMxKbd.show();
    });
    console.log("KM: Just added focus listener to ", usrDiv);
    // Did the answer field lose focus?
    usrDiv.addEventListener("blur", function(e){
        logEvent(e.type, "anonymous function on "+e.target);
        logEvent(e.type, "relatedTarget "+e.relatedTarget);

        // I suspect the lesson code is focusing on the button element after some time, causing a blur on the div,
        // check if relatedTarget is the input element and we are in a reading
        var lessonOrReview = ($("#reviews").length?"r":$("#lessons").length?"l":false);
        if (lessonOrReview === "l"){
            if (e.relatedTarget === $("#answer-form button")[0]){
                //Take back focus
                console.log("KM: Taking back focus from '#answer-form button'");
                e.target.focus();
            }
            else if (e.relatedTarget === $("#user-response")[0]){
                //Take back focus
                console.log("KM: Taking back focus from '#user-input'");
                e.target.focus();
            }
            else{
                kanaMxKbd.hide();
            }
        }
        else{
            kanaMxKbd.hide();
        }
    });

    // Listening for currentItem to change as trigger for enabling or disabling the matrix
    // In Reviews when first loading, this happens before the elements are given a size to measure
    // In Lessons it occurs after the page has
    $.jStorage.listenKeyChange(curItemKey, function(e){
        logEvent(arguments[1], "anonymous function on "+arguments[0]);
        console.log("%cKM:", "color:white; background-color: black", arguments);
        // clear span so cursor returns to the centre
        answerCopySpan.innerText = "";
        kanaMxKbd.contextEnable(e);
    });



    /*        loadingScreen.__remove = loadingScreen.remove;
        loadingScreen.remove = function(){
            runCounter++;
            if (runCounter === 1){

            }
            return loadingScreen.__remove.apply(this, arguments);
        }*/
    //  });

    // fix all the divs on resize (hopefully)
    window.addEventListener("resize", function(e){
        logEvent(e.type, "anonymous function on "+e.target);
        kanaMxKbd.resize();
        //enableKbd();
        //kanaMxKbd.contextEnable(e);
    });

    //for testing
    window.kanaMxKbd = kanaMxKbd;
})();
