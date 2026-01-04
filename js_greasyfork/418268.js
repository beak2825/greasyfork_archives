// ==UserScript==
// @name         Thief-Book in Browser
// @namespace    https://github.com/chocovon/thiefbook-js
// @version      0.3
// @description  浏览器版 Thief-Book 摸鱼神器
// @author       chocovon
// @match       http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418268/Thief-Book%20in%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/418268/Thief-Book%20in%20Browser.meta.js
// ==/UserScript==

(function() {
    let text = '按，。键翻页\n-键退出/恢复显示\nGood Luck!'
    let lines = [];
    let lineLength = 10;
    let pointer = 0;
    let keyNextLine = 'Period';
    let keyPreLine = 'Comma';
    let keyHide = 'Minus';
    let hide = false;
    let progress = 0;

    document.head.innerHTML +=
        '<style>\n' +
        '        .thief-book-line-box {\n' +
        '            position: fixed;\n' +
        '            left: 0;\n' +
        '            bottom: 0;\n' +
        '        }\n' +
        '        .thief-book-line {\n' +
        '            font-size: 10px;\n' +
        '            text-align:left;\n' +
        '            background-color: rgb(222,225,230);\n' +
        '            height: 23px;\n' +
        '            line-height: 23px;\n' +
        '            border-radius: 4px;\n' +
        '            padding-left: 5px;\n' +
        '            padding-right: 5px;\n' +
        '        }\n' +
        '        .thief-book-mouse-area {\n' +
        '            position: fixed;\n' +
        '            left: 0;\n' +
        '            bottom: 0;\n' +
        '            z-index: 99999;\n' +
        '            height: 70px;\n' +
        '            width:500px;\n' +
        '            margin: 1px;\n' +
        '        }\n' +
        '        .thief-book-mouse-area:hover .thief-book-settings-area {\n' +
        '            opacity: 1 !important;\n' +
        '        }\n' +
        '        .thief-book-settings-area {\n' +
        '            position: fixed;\n' +
        '            left: 60px;\n' +
        '            bottom: 30px;\n' +
        '            display: flex;\n' +
        '            transition: 0.3s;\n' +
        '        }\n' +
        '        .thief-book-semi-hide {\n' +
        '            opacity: 0;\n' +
        '        }\n' +
        '        .thief-book-icon {\n' +
        '            cursor: default;\n' +
        '            font-size: 30px;\n' +
        '            transition: 0.3s;\n' +
        '        }\n' +
        '        .thief-book-slider {\n' +
        '            height: 13px;\n' +
        '            width: 100px;\n' +
        '        }\n' +
        '        .thief-book-hide {\n' +
        '            display: none;\n' +
        '        }\n' +
        '    </style>';

    document.body.innerHTML +=
        '<div id="thief-book-leftCorner" class="thief-book-mouse-area">\n' +
        '    <div id="thief-book-settings" class="thief-book-settings-area">\n' +
        '        <label class="thief-book-icon">&#128193;\n' +
        '            <input type="file" id="thief-book-selectFile" style="display:none">\n' +
        '        </label>\n' +
        '        <label>\n' +
        '            <input id="thief-book-progressSlider" class="thief-book-slider" style="width:500px" type="range" min="0" max="2" value="0">\n' +
        '        </label>\n' +
        '        <label>\n' +
        '            <input id="thief-book-lineLengthSlider" class="thief-book-slider" type="range" min="5" max="70" value="20">\n' +
        '        </label>\n' +
        '    </div>\n' +
        '    <div id="thief-book-lineBox" class="thief-book-line-box"></div>\n' +
        '</div>';

    parseText(false);

    document.getElementById('thief-book-selectFile')
        .addEventListener('change', function(){
            let fr=new FileReader();
            fr.onload=function(){
                text = fr.result;
                parseText(false);
            }
            fr.readAsText(this.files[0]);
            document.getElementById('thief-book-settings').classList.add('thief-book-semi-hide');
        })
    document.getElementById('thief-book-progressSlider')
        .addEventListener('input', function(){
            pointer = parseInt(this.value);
            printLine(true);
        })
    document.getElementById('thief-book-progressSlider')
        .addEventListener('mouseup', function(){
            printLine();
        })
    document.getElementById('thief-book-lineLengthSlider')
        .addEventListener('input', function(){
            lineLength = parseInt(this.value);
            parseText(true)
        })
    window.addEventListener('keydown', function(e) {
        if (e.code === keyNextLine) {
            nextLine();
        } else if (e.code === keyPreLine) {
            preLine();
        } else if (e.code === keyHide) {
            onOff()
        }
    });


    function parseText(keepProgress) {
        lines = parseLines(text);
        if (keepProgress) {
            pointer = Math.round(progress * (lines.length - 1));
        } else {
            pointer = 0;
            progress = 0;
        }
        let slider = document.getElementById('thief-book-progressSlider')
        slider.min = 0;
        slider.max = lines.length - 1;
        printLine();
    }

    function parseLines(text) {
        text = text.replace(/\r/g, "")

        let i = 0,j = 0;
        let lines = [];
        while (j < text.length) {
            if (j - i > lineLength || text[j] === '\n') {
                lines.push(text.slice(i, j+1))
                i = ++j;
                continue;
            }
            j++;
        }
        if (j > i) {
            lines.push(text.slice(i, j))
        }
        return lines;
    }

    function nextLine() {
        if (pointer < lines.length - 1) {
            pointer++;
        }
        printLine()
    }
    function preLine() {
        if (pointer > 0) {
            pointer--;
        }
        printLine();
    }
    function onOff() {
        hide = !hide;
        printLine();
    }

    function printLine(multiLine) {
        if (hide) {
            document.getElementById('thief-book-leftCorner').classList.add('thief-book-hide');
        } else {
            document.getElementById('thief-book-leftCorner').classList.remove('thief-book-hide');
        }

        document.getElementById('thief-book-lineBox').innerHTML = ''

        if (multiLine) {
            let i = pointer - 20;
            while (i < pointer) {
                if (i < 0) {
                    i++;
                    continue;
                }
                createLine(i);
                i++;
            }
        }
        createLine(pointer);

        document.getElementById('thief-book-progressSlider').value = pointer;

        function createLine(ptr) {
            let newLine = document.createElement('div');
            newLine.classList.add('thief-book-line');
            let line = lines[ptr];
            if (line.length < lineLength) {
                line += '　'.repeat(lineLength - line.length);
            }
            newLine.innerText = calProgress(ptr) + '  ' + line;
            document.getElementById('thief-book-lineBox').append(newLine);
        }
    }

    function calProgress(ptr) {
        progress = ptr / (lines.length - 1);
        return ptr === lines.length - 1 ? '100.00%' :
            ('000' + ((100 * progress).toFixed(2))).slice(-5) + '%';
    }
})();