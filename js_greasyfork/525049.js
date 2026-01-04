// ==UserScript==
// @name               Moegirl Wiki Mobile Optimization
// @name:zh-CN         萌娘百科移动端优化
// @name:zh-TW         萌娘百科手機版優化
// @namespace          https://www.imxiaoanag.com
// @version            1.0.0
// @description        Optimize the mobile experience of Moegirl Wiki by removing annoying ad-block detection popups!
// @description:zh-CN  优化萌娘百科手机版体验，去除烦人的广告屏蔽提示！
// @description:zh-TW  優化萌娘百科手機端體驗，去除煩人的廣告屏蔽提示！
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMvu8A7YAAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuMgADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADp1fY4ytpsegAAB4VJREFUSEudVl1sk9cZfs/5zvn+bcdxHDuOQ2LHgUEKE0L9WSIKE9BKa4gqtlUUTeNm45JNmtSLXaBt0rqrSVNvJm4moVbqxTakiU7VULsIaZCiCgorYQQUNyFOYpvE8d9nf/6+87MLmyRyu6rsuTvved7n0XvO+33vQVJK+BIkSAECADBgBKh7+1mAvtLAZ/5aY63klQCgV+/t1/p1qneTAACg0Cpka1kFKWOhsTAJd2//L4OiU5wtzs5V5jjmoz2jB3sP7rZ3K6B00VqydXXl6pXFKxrWTo+dnoxOdhEAgAAAB+4y12Wuxz0mGcPsgfvgGrv2qfyUAUujdB7lc61cpBlBPmKCCSRAApKoxEpXl65+sPCBitWQGuI+FyAAgUnNPr0vpscsYiEppcOc1dbqSm1ls7nZEA1Hcx4qD2/IG/fRfa7ykBZKaslUPdWf79crusc9hhhw4IxX/epcae7z9c8JIocSh1LBlC99hSjxQPyF6AuTfZND5hCSUhZbxduV23eKd3KVXF3WHctZCa/M2/OlvtJWpYF8YGhl6GSJEk5ui37JZdktF5xCyS0JEEEtGLWjBjUkSEppMpQ8HD/8auLVtJkmAOByd91df9x4vNxYbkDDU71NvtkUTRAAuGPgKi414XxjGUvlHfxdBuhR9VG+mReKiNvxTG9mMDAYIiFVqipRw1Y4bactbHXuQMVqRI2k7JSNbB/7ru0um8suddcqa9KVKlIN3Uhr6bewmpALAHCuh62F37j+5HrBLwhX7BvYdzR5dHdgd4zGDG4AAFKQrdpBGuwYhEhof3D/kDbUEi0OvERKd7W7Ektap7iOwyKcoIlJunt6/WK7muHKe9GRnxf8TOhJqKJUkuHk3r69e8w9fbjPBFMIwYEjjAgmHQODGEmSTJrJdn5N1ogkLncTkAjQQBInE2riWO4vhDfaBMRrbOmXReVIuVkuNUqLG4u3lFsFtRChkZgZi1vxmBmjQDvkL38HBb8w58wteUtCiARJjOgjMbYa/vcUgm2mBHSBH39v5V6umosYkX6j38SmrdqpSGoiMXF04GjKTLWZ5GmCLPvlglNYqC5ka9liowgSLGIhC0XCkbHcb3aqAwAC+UP5yUdGJkqiClKEFE3eXK2uZt1sjdeCNBiKhYI0SDDpVOBI5+7G3ZnczOza7Fp9TUFKkAYRQgBwttf8kfjHTvUt/FmfLgWOBdUgkqgsyrP52ZtrNy1inUydfH3k9UwwYxMbAwDjrNQq3Svfm1mbufXkVoM3YkYsZseoSgvNxRPsn1uK59CP09nE1nKK3Tg+PDmVnjqdOX127OxrI6+lA2mPeflavtgoesyDdp+3ZKvoFhcri8VGMWpGp1JT5/efP7f33JmxM78d7I1hf0tRw5pBja2lwdbN5T+WWVmCNJCRNJJxO25rNgLEGOOCdwxc7q431jfcDQAY7Rk9MXzixK4TRxJHfjD44vfkf7bkACBIg7Zq74z0FS79fe7ix/mPC60CRjioBgNqQCMaALQPHwOAL32HOS53FaxQTIUU7WQ9+ytFejvlNKx1jQcKbOzJn66tXPvC+aIpm0IIEIAQQgpCCuoYSCF95nPGPc9bLC9+mP3w0sNLNx/9Htb/ulMLAC403v4kdqcreEwrfUuWMMIe9xzPabEWwkilqoKVjgFIEExwjztN59HGoyvZK+989oe+ld91CX0NTol/pYxhxFDNq7nCVbBiEIMg0jEQXAgmFKkYimGrtknM75vVUVzvlgF4O3Thxfy3u6MAhjvfs/E3KaTjOy53VUW1iKVitWPABRdSUEIHQgMTyYmf7HvjF+FqtwYAANjYJk+/zS7gpV8zXnK5yzjTkGYRa0cFIDhwrOCwGT4QPXBWW9ZErVsAAADOb751PX6rOwoAAArbSG++7zFPMqkruknN7TtAGGGMJZK+8MPsSU/x/e7sb4Y99Y9ioqqAYlLTJGa73zAA6EQPmSFCSMEpfKdyGQHrTv1mwCB+FshRhVrE0pXOK4QAgK3aiVAiYkXqq/UzBev4yE8PDx7WQLu3fm9mZWbT2zwUPzQ9Op2xM9eXrl/87GLZL7954M1Te06FUZgJhgTSqV4RlcsLl9/NvRsk1MKWCuq2gUGMpJUcD4/Ph+cXqgsPKg9a0FKRmqvmNr3NuBk/2HdwPDQeJmEppctcLriJzQF9oF/pb6sIEOVaue7VOXCNaIZi4KfDFrefbxEaeb7v+en09MuDLwdIYKm89HDzoS/98ej4K8OvTEQnBtQBk5hAQSAhheScc8Y7RwPAgTd4w5e+RjSb2u0GbaPTcyqoaSttJIyElbi/cf9x9TEDFjWjmZ7Mgd4Do9aojnUBokfvGeoZcjzHpjbn2wYt1uKcm9SMB+IxI7bzh7jd1BTTQXPQUqwRY6TSqggQJjV79d6IHtGx3i50l7XrpcGXmryZCqdMam7lYoxt1U7ayX3Rff1qf0gPbW19xcj8GuQb+fnqvAfeLmvXsDXcNgYAT3glr5R1sqvuqo3t50LPbU34ZzPwhOdwR0ihY90g2zcphPCl73DH5S7BJKAEDNI5pWcz+D/wX2G/hjjXbkBsAAAAAElFTkSuQmCC
// @author             imxiaoanag
// @match              http*://*.moegirl.org.cn/*
// @run-at             document-end
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/525049/Moegirl%20Wiki%20Mobile%20Optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/525049/Moegirl%20Wiki%20Mobile%20Optimization.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function removeAdBlockReminder() {
        let imgElements = document.querySelectorAll('img[src="https://www.gstatic.com/images/icons/material/system/1x/warning_amber_24dp.png"]');
        
        imgElements.forEach(img => {
            let innerDiv = img.parentElement;
            if (innerDiv) {
                let externalDiv = innerDiv.parentElement;
                if (externalDiv) {
                    externalDiv.parentElement.removeChild(externalDiv);
                }
            }
        });
    }

    removeAdBlockReminder();

    let observer = new MutationObserver(removeAdBlockReminder);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', removeAdBlockReminder);
})();