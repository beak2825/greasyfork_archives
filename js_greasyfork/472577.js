// ==UserScript==
// @name         电信网上大学超级学习多开支持
// @namespace    remain_true_to_our_original_aspiration
// @version      1.4
// @description  电信网上大学超级学习同时学习多门课程必备。
// @author       Ghost River
// @match        https://*.zhixueyun.com/
// @icon         data:image/gif;base64,R0lGODlhIAAgAPcAAAAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAACH5BAEAAPwALAAAAAAgACAAAAj/APcJHEiw4D5i9AwqXLiwnR9UD3nVY8iQXsKFxGr5eXWRIsFCfgrSs1XrFS93+2z54eVx4LBXqAqiKsSrly2QLDe23DfzIU2BtQbqQ/XqlcBXhDxqTGjrVch9fughpPfn51GjC3v5mbiPECquKmfSc5VqGEE/vRbaGuiwo621+3oRKtRxn0OGL/38cbWRZS+W+4rGLPgKbkGVtdwFDexnWDunM18VMkjvKeG1vP4E3ZjX1jCVdQf6aWfwMy/O9ZwWdKzW8EB6Md1F5UXIFkqplfcNa7x6cMFCw1wVmomqskaOm1G53pfbIC9Uvcz6Wcv5YNFCy5lbJuiu48WtApXNrSStcLtHVPqG9SpZEKHA5gYz+rFM6E9MrQV5ASbme2AviETB1RQqZg0FmECpAMbLYgM9R0haBM1kWCGpECJZZAhCSJCGZ2H13kaFIKWcdjsJRIxCnxVmVkoMltiSMuC5uNOILSVkkY0HMUfYZDthtg9La7mSEkEauWjLIhOl1Ys+xNQkWioyrhXUWrbUY5ZRp7W400XK0LMkc/QM9wd5MopE4Xy1rFgmZY6FtlBAADs=
// @run-at       document-start
// @license      GPL3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472577/%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0%E5%A4%9A%E5%BC%80%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/472577/%E7%94%B5%E4%BF%A1%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E8%B6%85%E7%BA%A7%E5%AD%A6%E4%B9%A0%E5%A4%9A%E5%BC%80%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //if (!window.location.href.match('/study/course/detail/')) return;
    if (!window.location.href.match('/train-new/class-detail/|/study/subject/detail/|/study/course/detail/|/study/course/out-detail/')) return;
    if (window) {
        delete window.WebSocket;
        if ('WebSocket' in window) {
            window.WebSocket = void 0;
        }
    }
})();