// ==UserScript==
// @name    Breed Việt hóa
// @description   Giao diện tiếng Việt cho Breed BootLoader
// @namespace   breed_vi
// @version   2020.04.10.f
// @author    Darias
// @include   http://192.168.1.1/*
// @downloadURL https://update.greasyfork.org/scripts/400183/Breed%20Vi%E1%BB%87t%20h%C3%B3a.user.js
// @updateURL https://update.greasyfork.org/scripts/400183/Breed%20Vi%E1%BB%87t%20h%C3%B3a.meta.js
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
   "系统信息": "Thông tin hệ thống",
   "固件更新": "Cập nhật Firmware",
   "固件备份": "Sao lưu Firmware",
   "频率设置": "Ép xung",
   "恢复出厂设置": "Khôi phục cài đặt gốc",
   "环境变量编辑": "Sửa biến môi trường",
   "环境变量设置": "Cài biến môi trường",
   "MAC 地址修改": "Sửa địa chỉ MAC",
   "重启": "Khởi động lại",
   "关于": "Giới thiệu",
   "操作正在进行": "Đang tiến hành...",
   "警告：在操作进行过程中请不要断开电源": "Cảnh báo: Vui lòng không tắt nguồn/tháo dây Lan khi thanh tiến trình chưa chạy xong",
   "完成": " hoàn thành",
   "设备正在": "Router đang ",
   "本页面不会刷新，请手动检查设备状态。": "Nhấn F5 để làm mới trang",
   "请耐心等待至进度条完成": "Hãy kiên nhẫn cho đến khi thanh tiến trình hoàn thành",
   "Breed Web 恢复控制台": "Trình điều khiển phục hồi Breed",
   "CPU 频率": "Tần số CPU",
   "DDR 时序优化": "Tối ưu hóa DDR",
   "DDR 频率": "Tần số DDR",
   "EEPROM": "EepRom",
   "Flash": "Bộ nhớ trong",
   "上传": "Tải lên",
   "以太网": "Ethernet",
   "保留现有 ": "Lưu ",
   "保留现有 Bootloader": "Lưu BootLoader hiện tại",
   "修改": "Sửa đổi",
   "修订号：": "Mã Build: ",
   "公版": "Công bản",
   "内存": "Bộ nhớ Ram",
   "单击 ": "Nhấp vào nút ",
   "单击按钮备份相应的数据": "Nhấn vào nút Sao Lưu để sao lưu dữ liệu",
   "启用环境变量可以使": "Kích hoạt biến môi trường cho phép sửa đổi cài đặt",
   "的一些": ", một số ",
   "能够被": " có thể ",
   "并保存": " Breed",
   "如果不清楚当前固件的类型": "Nếu bạn không biết loại Firmware hiện tại",
   "请选择 [Breed 内部]。": "vui lòng chọn",
   "内部": "nội bộ",
   "常规固件": "Firmware từng phần",
   "按钮以": " để ",
   "提示：如果超频后无法开机，请按住复位键再通电，系统将以默认频率启动。": "Mẹo: Nếu bạn không thể khởi động sau khi ép xung, hãy bấm và giữ nút Reset và sau đó bật nguồn, hệ thống sẽ bắt đầu ở tần số mặc định.",
   "斐讯": "Phi tấn",
   "时钟频率": "Tần số",
   "更新": "Cập nhật",
   "本产品仅供个人免费使用，禁止用于商业目的": "Sản phẩm này chỉ miễn phí cho sử dụng cá nhân và bị cấm cho mục đích thương mại",
   "版本": "Phiên bản",
   "精简": "Tinh giản",
   "编程器固件": "Toàn bộ Rom",
   "编译日期": "Ngày build",
   "联系作者": "Liên lạc với tác giả",
   "自动": "Tự động ",
   "请仅在十分熟悉固件结构、十分有把握的情况下，使用自定义位置。": "Vui lòng chỉ sử dụng vị trí tùy chỉnh nếu bạn biết rõ cấu trúc Firmware.",
   "请根据当前使用的固件类型": "Vui lòng chọn một vị trí phù hợp theo loại phần sụn hiện đang sử dụng",
   "选择合适的位置": "chọn sai có thể làm hỏng Firmware",
   "错误选择可能损坏固件甚至是": "hoặc thậm chí hỏng",
   "超频设置已保存。重启后生效": "Các cài đặt ép xung đã được lưu. Áp dụng sau khi khởi động lại",
   "路由": " Router",
   "选择当前内存容量值": "(Bảng điều khiển phục hồi web)",
   "闪存布局": "Cài bộ nhớ trong",
   "默认": "Mặc định",
   "文件名": "Tên tệp",
   "类型": "Loại",
   "大小": "Kích thước",
   "更新确认": "Xác nhận cập nhật",
   "请确认下方列出的信息": "Vui lòng xác nhận thông tin được liệt kê dưới đây",
   "文件已": "Tệp ",
   "RT6855/RT6856/MT7621 独立参数": "Thông số chip RT6855 / RT6856 / MT7621",
   "请首先启用环境变量再使用本功能": "Vui lòng kích hoạt các biến môi trường trước khi sử dụng chức năng này",
   "提示": "Chú ý",
   "返回": "Trở lại",
   "固件类型": "Loại Firmware",
   "执行": "Áp dụng",
   "正确的固件": "",
   "错误选择可能损坏固件": "chọn sai có thể làm hỏng Firmware",
   "或者导致": "Thậm chí có thể làm hỏng cả",
   "丢失": "",
   "自定义": "Tùy chỉnh",
   "设置": "Thiết lập",
   "启用": "Kích hoạt",
   "禁用": "Vô hiệu hóa",
   "起始地址": "Địa chỉ bắt đầu",
   "位置": "Vị trí",
   "控制": "Kiểm soát",
   "字节": "byte",
   "选择当前": "Dung lượng hiện tại của ",
   "容量值": "",
   "以": "để ",
   "MD5 校验": "Mã MD5",
   "确认": "",
   "正在": " Đang ",
   "请耐心等待至进度条": "hãy kiên nhẫn cho đến khi thanh tiến trình ",
   "请选择": "Vui lòng chọn Firmware tương thích",
   "地址已经被成功": " đã được ",
   "请耐心等待": "chờ xíu nhé!",
   "本页面不会自动刷新": "Trang này sẽ không tự động làm mới",
   "请自行检查是否": "Vui lòng kiểm tra xem Router có ",
   "成功": " thành công",
   "您选择的": "Xóa cài đặt ",
   "擦除": "Việc xóa ",
   "错误": "Lỗi kích thước",
   "不等于": " tối đa là",
   "_CN_": "_VN_",
  };
  for (var t in ts) {
   findAndReplace(t, ts[t]);
  }
  setTimeout(translate, 500);
 }

 setTimeout(translate, 500);

})();