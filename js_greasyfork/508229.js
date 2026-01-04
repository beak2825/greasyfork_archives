// ==UserScript==
// @name         AO3 Post New Work & Edit Work EN/VN Đăng và Chỉnh sửa tác phẩm AO3 dùng giao diện tiếng Việt
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Adding additional information in Vietnamese on Post New Work and Edit Work web page.
// @author       Furiositea
// @match        *://archiveofourown.org/works/new
// @match        *://archiveofourown.org/works/*/edit
// @icon         *://www.google.com/s2/favicons?domain=archiveofourown.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508229/AO3%20Post%20New%20Work%20%20Edit%20Work%20ENVN%20%C4%90%C4%83ng%20v%C3%A0%20Ch%E1%BB%89nh%20s%E1%BB%ADa%20t%C3%A1c%20ph%E1%BA%A9m%20AO3%20d%C3%B9ng%20giao%20di%E1%BB%87n%20ti%E1%BA%BFng%20Vi%E1%BB%87t.user.js
// @updateURL https://update.greasyfork.org/scripts/508229/AO3%20Post%20New%20Work%20%20Edit%20Work%20ENVN%20%C4%90%C4%83ng%20v%C3%A0%20Ch%E1%BB%89nh%20s%E1%BB%ADa%20t%C3%A1c%20ph%E1%BA%A9m%20AO3%20d%C3%B9ng%20giao%20di%E1%BB%87n%20ti%E1%BA%BFng%20Vi%E1%BB%87t.meta.js
// ==/UserScript==

(function() {
   'use strict';

   setTimeout (function () {

       // add user script instruction directly on the web page
       document.querySelector("#work-form > p").insertAdjacentHTML('afterEnd', '<p class="script note"> Nhắc nhở người dùng lập trình kịch bản: di chuột phía trên chữ sẽ hiện thêm hướng dẫn </p>')

       // selector
       const selector = [
           "#main > h2",
           "#work-form > p",
           "#work-form > fieldset.work.meta > dl > dt.rating.required > label",
           "#work-form > fieldset.work.meta > p",
           "#work-form > fieldset.work.meta > legend",
           "#work_rating_string > option:nth-child(1)",
           "#work_rating_string > option:nth-child(2)",
           "#work_rating_string > option:nth-child(3)",
           "#work_rating_string > option:nth-child(4)",
           "#work_rating_string > option:nth-child(5)",
           "#work-form > fieldset.work.meta > dl > dt.warning.required > label",
           "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(2) > label",
           "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(3) > label",
           "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(4) > label",
           "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(5) > label",
           "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(6) > label",
           "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(7) > label",
           "#work-form > fieldset.work.meta > dl > dt.fandom.required > label",
           "#work-form > fieldset.work.meta > dl > dt.category > label",
           "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(2) > label",
           "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(3) > label",
           "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(4) > label",
           "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(5) > label",
           "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(6) > label",
           "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(7) > label",
           "#work-form > fieldset.work.meta > dl > dt.relationship > label",
           "#work-form > fieldset.work.meta > dl > dt.character > label",
           "#work-form > fieldset.work.meta > dl > dt.freeform > label",
           "#work-form > fieldset.preface > dl > dt.title.required > label",
           "#work-form > fieldset.preface > dl > dt.byline.coauthors > label",
           "#work-form > fieldset.preface > dl > dt.summary > label",
           "#work-form > fieldset.preface > dl > dt.notes",
           "#work-form > fieldset.preface > dl > dd.notes > ul > li.start > label",
           "#work-form > fieldset.preface > dl > dd.notes > ul > li.end > label",
           "#associations > dl > dt.collection > label",
           "#associations > dl > dt.recipient > label",
           "#associations > dl > dd.parent > label",
           "#associations > dl > dd.serial > label",
           "#associations > dl > dd.chaptered.wip > label",
           "#associations > dl > dd.backdate > label",
           "#associations > dl > dt.language.required > label",
           "#associations > dl > dt.skin > label",
           "#work-form > fieldset.privacy > dl > dd.restrict > label",
           "#work-form > fieldset.privacy > dl > dd.moderated.comments > label",
           "#work-form > fieldset.privacy > dl > dt.permissions.comments",
           "#work-form > fieldset.privacy > dl > dd.permissions.comments > fieldset > ul > li:nth-child(1) > label",
           "#work-form > fieldset.privacy > dl > dd.permissions.comments > fieldset > ul > li:nth-child(2) > label",
           "#work-form > fieldset.privacy > dl > dd.permissions.comments > fieldset > ul > li:nth-child(3) > label",
           "#work-form > fieldset.work.text > legend",
           "#work-form > fieldset.work.text > p.rtf-html-instructions.note > span.html-notes",
           "#work-form > fieldset.work.text > ul > li:nth-child(1) > a",
           "#work-form > fieldset.work.text > p.notice"
       ];

       // add html title information
       const _title = {
           "Post New Work": "Đăng tác phẩm mới",
           "Edit Work": "Chỉnh sửa tác phẩm",
           "* Required information": "Các dòng chữ màu đỏ nghĩa là thông tin bắt buộc, có hoa thị (*) đánh dấu",
           "Tags are comma separated, 100 characters per tag. Fandom, relationship, character, and additional tags must not add up to more than 75. Archive warning, category, and rating tags do not count toward this limit.": "Dùng dấu phẩy ngăn cách giữa các tag (từ khóa), tối đa mỗi từ khóa được dùng 100 ký tự. Số lượng từ khóa fandom, mối quan hệ, nhân vật, và từ khóa bổ sung không được vượt quá 75. Cảnh báo AO3, Hạng mục và Giới hạn độ tuổi không tính vào giới hạn 75 từ khóa trên.",
           "Tags": "tag (từ khóa): từ khóa cho tác phẩm",
           "Rating*": "Giới hạn độ tuổi: *bắt buộc",
           "Not Rated": "Miễn giới hạn độ tuổi: Nếu bạn không muốn phân loại giới hạn độ tuổi của tác phẩm",
           "General Audiences": "Mọi độ tuổi: Nội dung phù hợp cho mọi độ tuổi",
           "Teen And Up Audiences": "Thanh thiếu niên trở lên: Bao gồm nội dung không phù hợp cho trẻ dưới 13 tuổi",
           "Mature": "Thành niên: Có nội dung giới hạn người xem (bạo lực, tình dục, v.v…), nhưng không được miêu tả chi tiết như Chỉ dành cho tuổi trưởng thành",
           "Explicit": "Chỉ dành cho tuổi trưởng thành: Nội dung bao gồm các yếu tố chỉ phù hợp cho tuổi trưởng thành (bạo lực, tình dục, v.v…) được được miêu tả chi tiết.",
           "Archive Warnings*": "cảnh báo AO3: *bắt buộc",
           "Choose Not To Use Archive Warnings": "Tác giả không dùng cảnh báo AO3: nếu bạn không muốn sử dụng cảnh báo AO3",
           "Graphic Depictions Of Violence": "Nội dung bạo lực (đẫm máu): tác phẩm có nội dung bạo lực/đẫm máu được miêu tả chi tiết",
           "Major Character Death": "Nhân vật chủ chốt tử vong",
           "No Archive Warnings Apply": "Cảnh báo của AO3 không khả dụng",
           "Rape/Non-Con": "Cưỡng hiếp/Không có sự đồng thuận",
           "Underage": "Hoạt động tình dục liên quan đến người dưới tuổi thành niên",
           "Fandoms*": "Fandom/Cộng đồng fan: *bắt buộc\nĐiền tên nguyên tác hoặc tên fandom, khuyến khích sử dụng tên đầy đủ của fandom thay vì viết tắt\nCó thể sử dụng nhiều từ khóa, sử dụng dấu phẩy ngăn cách giữa các từ khóa fandom.",
           "Categories": "Phân loại hạng mục: Phân chia mối quan hệ tình dục hoặc tình cảm trong tác phẩm của bạn. Có thể chọn nhiều hạng mục.",
           "F/F": "F/F (Nữ/Nữ): Mối quan hệ nữ tính/nữ tính",
           "F/M": "F/M (Nam/Nữ): Mối quan hệ nam tính/nữ tính",
           "Gen": "Gen (chung): Không có mối quan hệ tình dục hay tình cảm nào, hoặc các mối quan hệ không phải trọng điểm của tác phẩm.",
           "M/M": "M/M (Nam/Nam): Mối quan hệ nam tính/nam tính",
           "Multi": "Multi (nhiều): Có nhiều mối quan hệ, hoặc một quan hệ có nhiều người tham gia",
           "Other": "Other (khác): Các mối quan hệ khác",
           "Relationships": "Mối quan hệ: Liệt kê các mối quan hệ chủ yếu trong tác phẩm của bạn (có thể liệt kê nhiều mối quan hệ)\nKhuyến khích sử dụng tên đầy đủ trong từ khóa\nSử dụng dấu gạch chéo (“/”) biểu thị cho mối quan hệ tình dục hoặc tình cảm. Sử dụng dấu và (“&”) biểu thị cho mối quan hệ không liên quan đến tình dục/tình cảm như tình bạn, tình thân, tình đồng đội\nHãy dùng dấu phẩy ngăn cách giữa các từ khóa nếu có nhiều từ khóa",
           "Characters": "Nhân vật: Liệt kê nhân vật chủ chốt trong tác phẩm (có thể sử dụng nhiều từ khóa)\nKhuyến khích sử dụng tên đầy đủ trong từ khóa\nHãy dùng dấu phẩy ngăn cách giữa các từ khóa nếu có nhiều từ khóa, dùng từ khóa “original character” cho nhân vật bạn tự tạo ra.",
           "Additional Tags": "Từ khóa bổ sung: Liệt kê các từ khóa khác cho cho tác phẩm của bạn\nXin đừng điền tên fandom, các mối quan hệ hay từ khóa nhân vật ở mục này\nHãy dùng dấu phẩy ngăn cách giữa các từ khóa nếu có nhiều từ khóa",
           "Work Title*": "Tiêu đề tác phẩm: *bắt buộc\nTối đa 255 ký tự",
           "Add co-creators?": "Bổ sung đồng tác giả?\nSau khi bổ sung, đồng tác giả có thể biên tập chỉnh sửa tác phẩm",
           "Summary": "Tóm tắt: tóm tắt tác phẩm\nTối đa 1250 ký tự",
           "Notes": "Ghi chú: Chọn mục này để bổ sung ghi chú cho tác phẩm, có thể để ở đầu hoặc cuối chương truyện/tác phẩm.",
           "at the beginning": "thêm ghi chú vào đầu tác phẩm",
           "at the end": "thêm ghi chú vào cuối tác phẩm",
           "Post to Collections / Challenges": "Đăng tác phẩm vào Bộ sưu tập/Thử thách",
           "Gift this work to": "Tác phẩm được tặng cho. Điền tên người dùng được tặng tác phẩm vào đây.",
           "This work is a remix, a translation, a podfic, or was inspired by another work": "Tác phẩm này là một bản phối lại, một bản dịch, một truyện đọc, hoặc được lấy cảm hứng từ một tác phẩm khác\nNếu tác phẩm của bạn được lấy cảm hứng hoặc dựa trên một tác phẩm khác, hãy chọn mục này và điền thông tin bổ sung.",
           "This work is part of a series": "Tác phẩm này thuộc về một bộ tác phẩm (series)",
           "This work has multiple chapters": "Tác phẩm này có nhiều chương\nChọn mục này nếu tác phẩm của bạn có nhiều hơn một chương\nNếu bạn đã biết tác phẩm của mình sẽ có bao nhiêu chương, bạn có thể thay dấu chấm hỏi bằng tổng số chương.",
           "Set a different publication date": "Chọn một ngày đăng khác: Có thể điền ngày đăng trong quá khứ, không thể chọn ngày đăng trong tương lai.",
           "Choose a language *": "Chọn ngôn ngữ *",
           "Select work skin": "Chọn giao diện của tác phẩm (work skin)\nLựa chọn work skin nếu muốn",
           "Only show your work to registered users": "Chỉ hiển thị tác phẩm của bạn cho những người dùng đã đăng ký: chỉ người dùng đăng nhập AO3 mới có thể xem tác phẩm",
           "Enable comment moderation": "Bật phê duyệt bình luận: đánh dấu vào mục này để phê duyệt các bình luận trong tác phẩm của bạn.\nBình luận phải được bạn phê duyệt rồi mới hiển thị công khai.",
           "Who can comment on this work ?": "Những ai có thể bình luận",
           "Registered users and guests can comment": "cả người dùng đăng nhập và khách đều có thể bình luận",
           "Only registered users can comment": "Chỉ người dùng đăng nhập mới có thể bình luận",
           "No one can comment": "Tắt chế độ bình luận",
           "Work Text*": "Văn bản nội dung tác phẩm: *bắt buộc",
           "Plain text with limited HTML ?": "dạng văn bản thuần túy và dùng thẻ HTML có giới hạn",
           "Rich Text": "Văn bản giàu tính chất (rich text)：nhập và định dạng văn bản",
           "Note: Text entered in the posting form is not automatically saved. Always keep a backup copy of your work.": "AO3 không có chế động tự động lưu (autosave), hãy luôn giữ một bản sao lưu của tác phẩm."
       };

       // add translation pairs
       const _text = {
           "Post New Work": "Đăng tác phẩm mới",
           "Edit Work": "Chỉnh sửa tác phẩm",
           "* Required information": "* Các dòng chữ màu đỏ nghĩa là thông tin bắt buộc điền, có hoa thị (*) đánh dấu",
           "Tags are comma separated, 100 characters per tag.": "dùng dấu phẩy ngăn cách giữa các tag (từ khóa), tối đa mỗi từ khóa được dùng 100 ký tự",
           "Tags": "Tags (Từ khóa)",
           "Rating*": "Rating (Giới hạn độ tuổi)*",
           "Not Rated": "Not Rated (Miễn giới hạn độ tuổi)",
           "General Audiences": "General Audiences (Mọi độ tuổi)",
           "Teen And Up Audiences": "Teen And Up Audiences (Thanh thiếu niên trở lên)",
           "Mature": "Mature (Thành niên)",
           "Explicit": "Explicit (Chỉ dành cho tuổi trưởng thành)",
           "Archive Warnings*": "Archive Warnings (Cảnh báo AO3)*",
           "Choose Not To Use Archive Warnings": "Choose Not To Use Archive Warnings (Tác giả không dùng cảnh báo AO3)",
           "Graphic Depictions Of Violence": "Graphic Depictions Of Violence (Có miêu tả chi tiết nội dung bạo lực đẫm máu)",
           "Major Character Death": "Major Character Death (Nhân vật chủ chốt tử vong)",
           "No Archive Warnings Apply": "No Archive Warnings Apply (Cảnh báo của AO3 không khả dụng)",
           "Rape/Non-Con": "Rape/Non-Con (Cưỡng hiếp/Không có sự đồng thuận)",
           "Underage": "Underage (Hoạt động tình dục liên quan đến người dưới tuổi thành niên)",
           "Fandoms*": "Fandom/Cộng đồng fan*",
           "Categories": "Categories (Hạng mục)",
           "F/F": "F/F (Nữ/Nữ)",
           "F/M": "F/M (Nam/Nữ)",
           "Gen": "Gen (Chung)",
           "M/M": "M/M (Nam/Nam)",
           "Multi": "Multi (Nhiều)",
           "Other": "Other (Khác)",
           "Relationships": "Relationships (Mối quan hệ)",
           "Characters": "Characters (Nhân vật)",
           "Additional Tags": "Additional Tags (Từ khóa bổ sung)",
           "Work Title*": "Tiêu đề tác phẩm*",
           "Add co-creators?": "Thêm đồng tác giả?",
           "Summary": "Tóm tắt",
           "Notes": "Ghi chú",
           "at the beginning": "thêm vào đầu tác phẩm",
           "at the end": "thêm vào cuối tác phẩm",
           "Post to Collections / Challenges": "Đăng tác phẩm vào Bộ sưu tập/Thử thách",
           "Gift this work to": "Tác phẩm được tặng cho",
           "This work is a remix, a translation, a podfic, or was inspired by another work": "Tác phẩm này là một bản phối lại, một bản dịch, một truyện đọc, hoặc được lấy cảm hứng từ một tác phẩm khác",
           "This work is part of a series": "Tác phẩm này thuộc về một bộ tác phẩm (series)",
           "This work has multiple chapters": "Tác phẩm này có nhiều chương",
           "Set a different publication date": "Chọn một ngày đăng khác",
           "Choose a language *": "Chọn ngôn ngữ *",
           "Select work skin": "Chọn giao diện của tác phẩm (work skin)",
           "Only show your work to registered users": "Chỉ hiển thị tác phẩm của bạn cho những người dùng đã đăng ký",
           "Enable comment moderation": "Bật phê duyệt bình luận",
           "Who can comment on this work ?": "Những ai có thể bình luận",
           "Registered users and guests can comment": "<input type='radio' value='enable_all' name='work[comment_permissions]' id='work_comment_permissions_enable_all'> Cả người dùng đăng nhập và khách đều có thể bình luận",
           "Only registered users can comment": "<input type='radio' value='enable_all' name='work[comment_permissions]' id='work_comment_permissions_enable_all'> Chỉ người dùng đăng nhập mới có thể bình luận",
           "No one can comment": "<input type='radio' value='enable_all' name='work[comment_permissions]' id='work_comment_permissions_enable_all'> Tắt chế độ bình luận",
           "Work Text*": "Văn bản nội dung tác phẩm*",
//            "Plain text with limited HTML ?": "dạng văn bản thuần túy và dùng thẻ HTML có giới hạn",
           "Rich Text": "Văn bản giàu tính chất (rich text)",
//            "Type or paste formatted text.": "gõ hoặc dán văn bản được định dạng",
           "Note: Text entered in the posting form is not automatically saved. Always keep a backup copy of your work.": "Lưu ý: AO3 không có chế động tự động lưu (autosave), hãy luôn giữ một bản sao lưu của tác phẩm."
       };

       // iterate each selector to add translation and explanation
       selector.forEach(item => {
           try {
               document.querySelector(item).setAttribute("title", _title[document.querySelector(item).innerText])
               if (_text[document.querySelector(item).innerText] != undefined) {
                   document.querySelector(item).innerHTML = _text[document.querySelector(item).innerText]};

           } catch (e) {
               console.log(e);
           };
       });

       // Post buttons
       function checkAndReplace(path, original, title) {
           if (path.value == original) {
               path.value = title;
               return path.setAttribute("title",title)
           };
       };

       checkAndReplace(document.querySelector("#work-form > fieldset.create > ul > li:nth-child(1) > input[type=submit]"), "Preview", "Xem trước");
       checkAndReplace(document.querySelector("#work-form > fieldset.create > ul > li:nth-child(2) > input[type=submit]"), "Post", "Đăng tác phẩm");
       checkAndReplace(document.querySelector("#work-form > fieldset.create > ul > li:nth-child(3) > input[type=submit]"), "Cancel", "Hủy bỏ");


},1000);
})();