// ==UserScript==
// @name         Draft Tools v2
// @namespace    https://leaked.tools
// @version      2
// @description  Adds useful features to Cracked.sh's new-thread page.
// @author       Sango
// @match        *://cracked.sh/newthread.php?fid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cracked.sh
// @grant        none
// @updateURL    https://greasyfork.org/scripts/464022-draft-tools/code/Draft%20Tools.js
// @downloadURL  https://greasyfork.org/scripts/464022-draft-tools/code/Draft%20Tools.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("html").insertAdjacentHTML("beforeend", `
        <div id="DraftInput" class="modal" style="display:none;">
            <table>
                <tbody id="draft_inputs">
                </tbody>
            </table>
        </div>

        <div id="Sango" class="modal" style="display:none;">
            <div class="tborder" style="width:500px">
                <div class="thead">
                    <strong>Your Draft Templates</strong>
                </div>
            </div>
        </div>
        <style>.cke_bottom{display: block;}</style>
    `);

    var src = `
        var message = ""; var title = ""; var matches = [];
        function show_modal(e) {
            message = e.closest("#Sango .trow1").querySelector(".message_plain").textContent;
            console.log(message);
            title = e.closest("#Sango .trow1").querySelector('.message_title').textContent;
            matches = (title+message).match(/(?<=\{)([A-Za-z0-9_]*?)(?=\})/gm);
            matches = [...new Set(matches)];
            document.querySelector('#draft_inputs').innerHTML = '<tr><td class="thead"><strong>Draft Text Input</strong></td></tr>';
            for (const match of matches) {
                document.querySelector('#draft_inputs').innerHTML += '<tr><td class="trow1"><input type="text" id="'+match+'" class="textbox" placeholder="'+match.replace(/_/g, " ")+'"/></td></tr>';
            }
            document.querySelector('#draft_inputs').innerHTML += '<tr><td class="trow1" style="text-align: center;"><a href="#close-modal" rel="modal:close""><input type="button" class="button" value="Inject" onclick="inject()"></td></a></td></tr>';
            $("#DraftInput").modal({ keepelement: !0 });
            return false;
        };

        function show_preview(e) {
            var id = e.closest("#Sango .trow1").id;
            document.querySelectorAll('#Sango .trow1:not(#'+id+') .message_preview').forEach(function(preview) {
                preview.style.display = "none";
            });
            $('#Sango .trow1#'+id+' .message_preview').toggle();
            return false;
        };

        function inject() {
            document.querySelectorAll('#draft_inputs input[type="text"]').forEach(function(input) {
                var matchID = input.id;
                var matchVal = input.value;
                var regex = "{"+matchID+"}";
                regex = new RegExp(regex,'gm');
                message=message.replace(regex, matchVal);
                title=title.replace(regex, matchVal);
            });
            // apply gradients
            message = processGradientInput(message);
            var source_mode = false;
            if (!document.querySelector('textarea.cke_source')) {
                source_mode = true;
                document.querySelector(".cke_button__source").click();
            }
            var message_val = document.querySelector('textarea.cke_source').value || "";
            document.querySelector('textarea.cke_source').value = message_val+' '+message;
            document.querySelector('input[name=subject]').value = title;
            if (source_mode === true) {
                setTimeout(function() {
                    document.querySelector(".cke_button__source").click();
                }, 100);
            }
        }

        function bbGradient(text, colors) {
          var output = "";
          var rainbow = ['#FF2323', '#FF23F2', '#A133FF', '#326CFF', '#23EDFF', '#23FFA4', '#23FF23', '#FFF723', '#FF8B23'];
          if (colors === "rainbow") colors = rainbow;
          colors = colors.map(color => (color === 'random' ? rainbow[Math.floor(Math.random() * rainbow.length)] : (!color.startsWith("#") ? '#'+color : color)));
          var colorCount = colors.length;
          var colorIncrement = 1 / (colorCount - 1);
          var textLength = text.length;
          for (var i = 0; i < textLength; i++) {
            var colorIndex = Math.floor(i * (colorCount - 1) / textLength);
            var colorPercent = (i * (colorCount - 1) / textLength) % 1;
            var colorStart = colors[colorIndex];
            var colorEnd = colors[colorIndex + 1] || colorStart;
            var color = lerpColor(colorStart, colorEnd, colorPercent);
            output += "[color=" + color + "]" + text.charAt(i) + "[/color]";
          }
          return output;
        }

        function lerpColor(color1, color2, percent) {
          var validHex = /^#([0-9A-F]{3}){1,2}$/i;
          if (!validHex.test(color1)) color1 = "#FFFFFF";
          if (!validHex.test(color2)) color2 = "#FFFFFF";

          var r1 = parseInt(color1.substring(1, 3), 16);
          var g1 = parseInt(color1.substring(3, 5), 16);
          var b1 = parseInt(color1.substring(5, 7), 16);
          var r2 = parseInt(color2.substring(1, 3), 16);
          var g2 = parseInt(color2.substring(3, 5), 16);
          var b2 = parseInt(color2.substring(5, 7), 16);
          var r = Math.round((1 - percent) * r1 + percent * r2).toString(16);
          var g = Math.round((1 - percent) * g1 + percent * g2).toString(16);
          var b = Math.round((1 - percent) * b1 + percent * b2).toString(16);
          return "#" + padZero(r) + padZero(g) + padZero(b);
        }

        function padZero(str) {
          return str.length == 1 ? "0" + str : str;
        }

        function processGradientInput(input) {
          const regex = /\\[gradient(?:=(rainbow|.*?))?\\](.+?)\\[\\/gradient\\]/gm;
          let match = regex.exec(input);
          while (match != null) {
            console.log(match);
            let colors = [];
            let text = match[2];
            if (!Boolean(match[1])) {
              colors = ["random", "random", "random"];
            } else if (match[1] === 'rainbow') {
              colors = "rainbow";
            } else {
              colors = match[1].split(',').map(color=>color.trim())
            }
            text = bbGradient(text, colors);
            input = input.replace(match[0], text);
            match = regex.exec(input);
          }
          return input;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://cracked.sh/usercp2.php?action=get_templates', true);
        xhr.onload = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    var data = xhr.responseText;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(data, 'text/html');
                    var rows = doc.querySelectorAll('.trow1');
                    var sangoDiv = document.querySelector('#Sango > .tborder');
                    rows.forEach(function(row) {
                        row.querySelector('span.insert_link').setAttribute('onclick', 'show_modal(this)');
                        row.querySelector('span.preview_link').setAttribute('onclick', 'show_preview(this)');
                        sangoDiv.appendChild(row);
                    });
                } else { alert("Draft Tools Error: Failed to retreive templates."); }
            }
        };
        xhr.send(null);
    `;
    const script = document.createElement('script');
    script.textContent = src;
    document.body.appendChild(script);

    document.querySelector("a[title='Drafts Templates']").setAttribute("rel", "");
    document.querySelector("a[title='Drafts Templates']").setAttribute("onclick", "$('#Sango').modal({ keepelement: !0 });return false;");
})();