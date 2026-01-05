// ==UserScript==
// @name         A MEdical Center Helper
// @version      1.1.2
// @description  아메센터 이용시 도움이 될 수 있는 기능들을 추가 하였습니다.
// @match        http://www.*.org/bbs/board.php*
// @include      http://www.*.org/bbs/board.php*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @namespace    http://bygoda.tistory.com/
// @author       thebest
// @copyright    2015, thebest, skfk4fkd@gmail.com
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/10452/A%20MEdical%20Center%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/10452/A%20MEdical%20Center%20Helper.meta.js
// ==/UserScript==
if(!document.domain.match(/www\.\w+ame.org/i)) return;

(function($){
    var secritMode = GM_getValue('secritMode', true);

    function downloadImage(imageUrl, fName) {
        if (/msie|trident/i.test(navigator.userAgent)) { // IE 인지 체크
            var _window = window.open(imageUrl, '_blank'); // 새창으로 열어서..
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fName); // 저장하라, false 로 해도 동일
            _window.close(); // 끝나면 새창 닫음
        } else {
            var $a = $("<a>", {
                href: imageUrl,
                download: fName,
                text: fName,
                type: 'image/jpeg'
            }).appendTo("body"); // HTML 5 가 가능한 녀석들은 좋아..
            $a[0].click();
            //$a.remove();
        }
    }

    function setNumberFormat(value, length) {
        var padSize = length - value.toString().length;
        for (var i = 0; i < padSize; i++) {
            value = '0' + value.toString();
        }
        return value;
    };

    $(document).ready(function(){
        $('#view_content img').each(function(){
            //이미지 주소 현재 도메인과 동기화
            if(this.src.indexOf(document.domain) == -1){
                this.src = this.src.replace(/www\.\w+ame.org/g, document.domain);
            }

            //사생활 보호를 위해 옅은 투명도 적용
            if(secritMode){
                $(this).css('opacity', 0.1)
                .hover(
                    //이미지에 마우스를 올릴 시 투명도 제거
                    function(){ $(this).animate({ opacity: 1 }, 'slow') },
                    function(){ $(this).stop().css('opacity', 0.1) }
                );
            }
        });

        var btnDownload = $('<a>', {
            text: '이미지 일괄 다운로드',
            css: {
                border: '1px solid red',
                padding: '5px',
                width: '120px',
                fontSize: '9pt',
                textAlign: 'center',
                marginLeft: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'red'
            },
            click: function(){
                $('#view_content img').each(function(imgInfoIdx, imgInfo){
                    var fileUrl = imgInfo.src;
                    var extension = fileUrl.split('.').pop();
                    var fileTitle = $('.mw_basic_view_subject').text().replace(/(^\s+)|(\s+$)/g, '');
                    var fileName = fileTitle + '_' + setNumberFormat(imgInfoIdx, 3) + extension;
                    downloadImage(fileUrl, fileName);
                });
            }
        });

        var chkSecritMode = $('<input>', {
            type: 'checkbox',
            checked: secritMode,
            id: 'chkSecritMode',
            change: function(){
                secritMode = $(this).is(':checked');
                GM_setValue('secritMode', secritMode);
                alert('A MEdical Center Helper\r\n시크릿 모드(' + (secritMode ? '적용' : '해제') + ')로 시작합니다.');
                document.location.reload();
            }
        });

        var lblSecritMode = $('<label for="chkSecritMode">사생활보호</label>');

        var wrapSecritMode = $('<a>', {
            css: {
                border: '1px solid red',
                padding: '5px',
                width: '100px',
                fontSize: '9pt',
                textAlign: 'center',
                marginLeft: '20px',
                fontWeight: 'bold',
                color: 'red'
            }
        });
        wrapSecritMode.append(chkSecritMode);
        wrapSecritMode.append(lblSecritMode);

        $('.mw_basic_view_name').append(btnDownload);
        $('.mw_basic_view_name').append(wrapSecritMode);

    });

})(jQuery);