// ==UserScript==
// @name               Course ZJU Open in New Tab
// @namespace          https://www.cc98.org/user/name/ml98
// @description        Make the links in courses.zju.edu.cn always open in new tab
// @description:zh-CN  让学在浙大首页的链接总是在新标签页中打开
// @version            0.0.1
// @author             ml98
// @license            MIT
// @match              https://courses.zju.edu.cn/user/index
// @downloadURL https://update.greasyfork.org/scripts/437276/Course%20ZJU%20Open%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/437276/Course%20ZJU%20Open%20in%20New%20Tab.meta.js
// ==/UserScript==

/* eslint-disable no-undef */

(function() {
    'use strict';
    setInterval(()=>{
        // links
        $('a[ng-href]:not(.__visited_f3641d)').addClass('__visited_f3641d')
          .off('click').attr('target', '_blank');

        // todos
        $('a[ng-click^="openActivity"]:not(.__visited_f3641d)').addClass('__visited_f3641d')
          .off('click').on('click', (e)=>{
            let payload = $(e.target).scope().activity;
            window.open($(e.target).scope().activity.url, '_blank')
        });

        // activities
        $('a[ng-click^="linkToActivity"]:not(.__visited_f3641d)').addClass('__visited_f3641d')
          .off('click').on('click', e=>{
            let payload = $(e.target).scope().n.payload;
            window.open('/course/' + payload.course_id + '/learning-activity#/' + payload.activity_id, '_blank');
        });

        // uploads
        $('.notification-attachment-uploads:not(.__visited_f3641d)').addClass('__visited_f3641d')
          .off('click').on('click', async e=>{
            let n = $(e.target).scope().n;
            if (['web_link', 'slide', 'lesson', 'online_video'].indexOf(n.payload.activity_type) == -1
              && n.payload.uploads.length != 0) {
                let uploads = n.payload.uploads;
                let resp = await Promise.all(uploads.map(upload=>fetch('/api/uploads/reference/document/'
                                                                       + upload.reference_id + '/url?preview=true')));
                let json = await Promise.all(resp.map(res=>res.json()));
                let files = json.map((j,i)=>`<a href="${j.url}">${uploads[i].file_name}</a>`).join('<br>');
                window.open('', '_blank').document.body.outerHTML = files;
            }
        })
    }, 3000);
})();
