// ==UserScript==
// @name         rgrongfucker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  now rgrong newbies are able to attach images
// @author       You
// @match        https://te31.com/rgr/write.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424461/rgrongfucker.user.js
// @updateURL https://update.greasyfork.org/scripts/424461/rgrongfucker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let html = '	<tr><Td>\
\
\
\
\
\
\
		<div id="fileUploader" class="fileUploader" style="min-height:5px;"><!--File upload zone-->\
			<div id="drag" style="border:2px solid #000;border-radius:8px;height:100px;font-size:12px;background-image:url(bit.png?v3);">\
			\
				<div id="output" style="text-align:left;">\
\
				</div>\
			<div class="drop_str" style="font-size:12px; color:#777;" >\
\
\
		\
\
</div>\
				<div>\
					<div class="imgur_btn">\
						\
						<!--<button id="dbutton" class="AXButton Blue" onclick="return false">폴더째 업로드</button>-->\
						<!--<button id="zbutton" class="AXButton Blue" onclick="return false">압축파일(zip)로 업로드</button>-->\
					</div>\
				</div>\
			</div>\
			<input type="file" style="display:none;" accept="image/*" id="filesinput" multiple />\
			<input type="file"  style="display:none;" id="directoryinput" multiple webkitdirectory />\
			<input type="file" style="display:none;" accept="application/zip" id="zipinput" />\
<div id=complete name=complete style="font-size:11px;padding-left:4px;"><span class=eng><span style="color:#bd2c2c;font-weight:bold;">▲ 드래그 업로드 가능</span> : 업로드가 완료되면 썸네일이 나타납니다.  순서에 맞게 올리시려면 파일을 1개씩 첨부하세요.</span></div>\
        </div>\
\
   \
<div name=plusimgur>\
<textarea name="imgur" id=htmltag style="width:789px;display:none;" readonly="readonly" onclick="this.select();"></textarea>\
\
</div>\
\
\
\
<script type="text/javascript" src="js/upload.js?v=202006273"></script>\
<script type="text/javascript" src="js/zip.js"></script>\
</td></tr>'

    function appendScript(src) {
        let script = document.createElement('script')
        script.src = src
        document.body.appendChild(script)
    }

    fbutton.closest('tr').insertAdjacentHTML('afterend', html)

    appendScript('js/upload.js?v=202006273')
    appendScript('js/zip.js')


})();