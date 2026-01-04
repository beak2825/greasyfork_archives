// ==UserScript==
// @name         基金从业人员远程培训系统 快速学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        peixun.amac.org.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34359/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E4%BA%BA%E5%91%98%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F%20%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/34359/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E4%BA%BA%E5%91%98%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F%20%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setInterval(autoFinish,500);
})();

var old_cid, old_ucid, old_artid, old_fid;

function autoFinish()
{
    try
    {
        if (typeof(request) == "undefined") return;
        var cid =request('cid'),ucid=request('ucid'),artid =request('artid'),fid =request('fid');
        if (old_cid==cid && old_ucid==ucid && old_artid==artid && old_fid==fid) return;

        if (typeof(player) == "undefined") return;
        if (typeof(player.getDuration) == "undefined") return;
        var movieTime = player.getDuration();

        var artInfo = getArtStudy(cid, ucid,fid, artid);    //该操作会发出HTTP查询请求

        if (artInfo.studytime < movieTime)
        {
            //标记完成信息
            artstudytime(cid,ucid,fid,artid,'2',player.getDuration());

            //再次检查是否提交成功
            artInfo = getArtStudy(cid, ucid,fid, artid);
            if (artInfo.studytime == movieTime)
            {
                console.log('自动标记学习成功 进度:' + artInfo.studytime + '/' + player.getDuration());
                tiper('自动标记学习成功');

                old_cid=cid;old_ucid=ucid;old_artid=artid;old_fid=fid;
            }
        }
        else
        {
            old_cid=cid;old_ucid=ucid;old_artid=artid;old_fid=fid;
        }
    }
    catch(e)
    {
        console.log(e);
    }

}