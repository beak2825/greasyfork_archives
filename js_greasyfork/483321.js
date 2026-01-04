// ==UserScript==
// @name         网页推送
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个将当前网页信息通过http请求进行推送的插件。
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483321/%E7%BD%91%E9%A1%B5%E6%8E%A8%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/483321/%E7%BD%91%E9%A1%B5%E6%8E%A8%E9%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CDN链接
    let bootstrapCssCDN = "https://cdn.staticfile.org/twitter-bootstrap/5.1.1/css/bootstrap.min.css";
    let bootstrapJsCDN = "https://cdn.staticfile.org/twitter-bootstrap/5.1.1/js/bootstrap.bundle.min.js";
    let jqueryCDN = "http://cdn.static.runoob.com/libs/jquery/1.10.2/jquery.min.js";

    // 在head中插入bootstrap CSS
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = bootstrapCssCDN;
    document.head.appendChild(link);

    // 在body底部插入JQuery和bootstrap JS
    let script1 = document.createElement('script');
    script1.src = jqueryCDN;
    document.body.appendChild(script1);

    let script2 = document.createElement('script');
    script2.src = bootstrapJsCDN;
    document.body.appendChild(script2);

    let circleButton = document.createElement('div');
    circleButton.innerHTML = '<button class="btn btn-primary position-fixed bottom-0 end-0 m-3" data-bs-toggle="modal" data-bs-target="#myModal">+</button>';

    let modalHTML = `
    <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">推送当前网页</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="note-content" class="form-label">备注内容</label>
                <textarea class="form-control" id="note-content"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary" id="push-text">仅推送文本</button>
            <button type="button" class="btn btn-primary" id="push-page">推送网页</button>
          </div>
        </div>
      </div>
    </div>`;

    document.body.appendChild(circleButton);
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    let pushPage = document.getElementById('push-page');
    let pushText = document.getElementById('push-text');
    let noteContent = document.getElementById('note-content');

    // After the modal is shown, focus on the textarea
    $('#myModal').on('shown.bs.modal', function () {
      $('#note-content').trigger('focus');
    });

    // When Enter key is pressed, trigger pushPage click event
    $('#myModal').keypress(function (e) {
      if (e.which == 13) {
        $('#push-page').trigger('click');
      }
    });

    pushPage.onclick = function() {
        let title = document.title;
        let url = window.location.href;
        let note = noteContent.value;
        let content = `网页标题：<b>${title}</b><br><br>网页链接：<b><a href="${url}">${url}</a></b><br><br>备注：<b>${note}</b>`;
        let requestURL = `https://www.pushplus.plus/send?token=a167fa21324c4817ad72b731103ed44c&title=${title}&content=${content}&template=html`;

        fetch(requestURL).then(response => {
            alert(response.ok ? '推送成功' : '推送失败');
            $('#myModal').modal('hide');  // Close the modal after push
        });
    }

    pushText.onclick = function() {
        let note = noteContent.value;
        let requestURL = `https://www.pushplus.plus/send?token=a167fa21324c4817ad72b731103ed44c&title=${note}&content=${note}&template=html`;

        fetch(requestURL).then(response => {
            alert(response.ok ? '推送成功' : '推送失败');
            $('#myModal').modal('hide');  // Close the modal after push
        });
    }

})();
