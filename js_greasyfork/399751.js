// ==UserScript==
// @name		web.avjie.com Việt hóa
// @description	Giao diện tiếng Việt cho web.avjie.com
// @namespace	web.avjie.com_vi
// @version		2020.10.19.a
// @author		Darias
// @include		*://web.avjie.com/*
// @downloadURL https://update.greasyfork.org/scripts/399751/webavjiecom%20Vi%E1%BB%87t%20h%C3%B3a.user.js
// @updateURL https://update.greasyfork.org/scripts/399751/webavjiecom%20Vi%E1%BB%87t%20h%C3%B3a.meta.js
// ==/UserScript==

(function() {

 function findAndReplace(searchText, replacement, searchNode) {
  if (!searchText || typeof replacement === 'undefined') {
   // Throw error here if you want...
   return;
  }
  var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText,
   childNodes = (searchNode || document.body).childNodes,
   cnLength = childNodes.length;
  excludes = 'html,head,style,title,link,meta,script,object,iframe';
  while (cnLength--) {
   var currentNode = childNodes[cnLength];
   if (currentNode.nodeType === 1 && (',' + excludes + ',').indexOf(',' + currentNode.nodeName.toLowerCase() + ',') === -1) {
    arguments.callee(searchText, replacement, currentNode);
   }
   if (currentNode.nodeType !== 3 || !regex.test(currentNode.data)) {
    continue;
   }
   var parent = currentNode.parentNode,
    frag = (function() {
     var html = currentNode.data.replace(regex, replacement),
      wrap = document.createElement('div'),
      frag = document.createDocumentFragment();
     wrap.innerHTML = html;
     while (wrap.firstChild) {
      frag.appendChild(wrap.firstChild);
     }
     return frag;
    })();
   parent.insertBefore(frag, currentNode);
   parent.removeChild(currentNode);
  }
 }

 function translate() {
  var ts = {
    "_CN_": "_VN_",
    "该网页未找到": "Không tải được file",
    "重定向到": "Đường dẫn",
    "连接到：": "kết nối tới: ",
    "端口": "cổng",
    "用时：": "Thời gian: ",
    " 分 ": " phút ",
    " 秒": " giây",
    "平均速度：": "Tốc độ tải: ",
    "回到主页": "Quay lại trang chủ",
    "更名为": "đổi tên thành ",
    "没有发现文件": "Không tìm thấy tập tin",
    "已": "Đã ",
    "错误": "Mã lỗi",
    "从文件": "Từ tập tin",
    "不存在": "không tồn tại",
    "主窗口": "Tab Chính",
    "设置": "Thiết lập",
    "服务器文件": "Tập tin",
    "链接检查器": "Kiểm tra liên kết",
    "插件": "Gắn thêm",
    "链接到Transload": "Liên kết tải",
    "用户名 & 密码": "ID & PASS",
    "添加注释": "Chú thích",
    "在使用:": "Dung lượng dùng: ",
    "引用": "Trích dẫn",
    "CPU负载": "CPU dùng",
    "Transload文件": "Tải tập tin",
    "自动Transload": "Tự động tải",
    "自动上传": "Tự động tải lên",
    "全部选中": "Chọn tất cả",
    "取消": "Bỏ ",
    "反向选择": "Đảo chọn",
    "按文本匹配": "Kết hợp văn bản",
    "显示": "Hiển thị",
    "所有": "tất cả",
    "下载": "tải xuống",
    "名称": "Tên",
    "大小": "Kích thước",
    "注释": "Nhận xét",
    "日期": "Nhật ký",
    "动作": "Hành động",
    "上传": "Tải lên",
    "FTP文件": "Tệp FTP",
    "电子邮件": "Email",
    "分割文件": "Tách tập tin",
    "合并文件": "Hợp nhất các tệp",
    "MD5哈希": "Tính MD5",
    "MD5更改": "Đổi MD5",    
    "包文件": "Gói tệp",
    "制作ZIP文件": "Tạo tệp Zip",
    "解压Zip文件": "Giải nén tệp Zip",
    "制作RAR文件": "Tạo tệp Rar",
    "解压RAR文件": "Giải nén tệp Rar",
    "重命名": "Đổi tên",
    "删除": "Xoá",
    "链接列表": "Danh sách liên kết",
    "至少选择一个文件": "Chọn ít nhất một tệp",
    "支持以下网站": "Các trang hỗ trợ",
    "调试模式": "Chế độ gỡ lỗi",
    "只显示链接:": "Chỉ hiển thị các liên kết:",
    "只显示删除链接:": "Chỉ hiển thị liên kết xóa:",
    "检查链接:": "Kiểm tra liên kết",
    "使用高级帐户": "Tài khoản trả phí",
    "发送文件到": "Gửi tệp đến ",
    "选项:": " tuỳ chọn",
    "禁用所有插件": "Vô hiệu hóa tất cả gắn thêm",
    "保存": "Lưu ",
    "使用代理": "Sử dụng proxy ",
    "清除当前": "Xoá ",
    "方法": "Phương pháp",
    "分段": "Phân ",
    "用户名": "ID",
    "密码": "PASS",
    "代理": "Đại lý",
    "附加": "Giá trị ",
    "值": " bổ sung",
    "禁用": "Vô hiệu ",
    "使用": "Sử dụng",
  };
  for (var t in ts) {
   findAndReplace(t, ts[t]);
  }
  setTimeout(translate, 500);
 }

 setTimeout(translate, 500);

})();