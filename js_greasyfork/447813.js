/* ==UserStyle==
   @name               真白萌：更好的用戶介面
   @description        透過調整真白萌的用戶介面來改善使用體驗。
   @author             Jason Kwok
   @namespace          https://jasonhk.dev/
   @version            1.1.0
   @license            MIT
@downloadURL https://update.greasyfork.org/scripts/459624/%E7%9C%9F%E7%99%BD%E8%90%8C%EF%BC%9A%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%94%A8%E6%88%B6%E4%BB%8B%E9%9D%A2.user.css
@updateURL https://update.greasyfork.org/scripts/459624/%E7%9C%9F%E7%99%BD%E8%90%8C%EF%BC%9A%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%94%A8%E6%88%B6%E4%BB%8B%E9%9D%A2.meta.css
   ==/UserStyle== */

@-moz-document url-prefix("https://masiro.me/admin")
{
    .message-content-list-item-content
    {
        -webkit-line-clamp: revert !important;
    }
}

@-moz-document url-prefix(https://masiro.me/admin/noticeCenter)
{
    .sys-notice-item .sys-notice
    {
        height: revert;
    }

    .sys-notice-item .notice_details
    {
        float: revert;
        width: revert;
    }

    .sys-notice-item .notice_details > div:first-of-type
    {
        float: revert !important;
    }

    .sys-notice-item .sys_notice_content
    {
        margin-top: 12.15px;
        max-height: revert;
        white-space: revert;
    }
}

@-moz-document url-prefix(https://masiro.me/admin/noticeMiddlePage)
{
    .notice > div:last-of-type
    {
        width: 98% !important;
        height: revert !important;
    }
}

@-moz-document url-prefix(https://masiro.me/admin/novelView)
{
    .n-ori
    {
        -webkit-line-clamp: revert;
    }
}