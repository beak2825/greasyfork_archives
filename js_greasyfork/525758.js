// ==UserScript==
// @name         Bloxd.io Super Message Sender
// @namespace    https://example.com/      // استخدم عنوان URL فريد هنا
// @version      1.0                       // رقم الإصدار (تم تحديده هنا)
// @description  Automatically adds ✨Super✨ at the start of every message sent in Bloxd.io chat when pressing Enter.
// @match        https://www.bloxd.io/*    // تحديد المكان الذي يتم تطبيق السكريبت عليه
// @grant        none                       // لا نحتاج إلى صلاحيات إضافية
// @license      MIT                        // الترخيص
// @downloadURL https://update.greasyfork.org/scripts/525758/Bloxdio%20Super%20Message%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/525758/Bloxdio%20Super%20Message%20Sender.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        var messageBox = document.querySelector('.chat-input'); // تأكد من أن هذا هو العنصر الذي يكتب فيه المستخدم الرسائل
        var message = messageBox.value;
        
        if (message !== '') {
            messageBox.value = "✨Super✨ " + message; // إضافة ✨Super✨ في بداية الرسالة
            messageBox.dispatchEvent(new Event('input')); // لتحديث المدخل
        }
    }
});