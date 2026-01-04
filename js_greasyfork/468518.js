// @license           End-User License Agreement
 function DECqrcode() {
    	 let dialogHtml = '<div id="qrcodeDialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; width: 400px; background-color: #ffffff; border-radius: 5px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">';
        dialogHtml += '<div style="font-size: 20px;">选择需要解析的二维码图片</div>';
        dialogHtml += '<hr>';
        dialogHtml += '<input id="qrcodeFileInput" type="file" accept="image/*" style="margin-bottom: 20px;">';
        dialogHtml += '<button id="qrcodeCancelBtn" style="float: right;  padding: 2px 5px; font-size: 14px; text-align: center;   color: rgb(255, 255, 255); background-color: rgb(66, 185, 131); border: none;border-radius: 3px; cursor: pointer;">关闭</button>';
        dialogHtml += '<button id="qrcodeConfirmBtn" style="float: right; margin-right: 10px; padding: 2px 5px; font-size: 14px; text-align: center;   color: rgb(255, 255, 255); background-color: rgb(66, 185, 131); border: none;border-radius: 3px; cursor: pointer;">确定</button>';
        dialogHtml += '</div>';
        $('body').append(dialogHtml);

        // 取消按钮事件
        $('#qrcodeCancelBtn').on('click', function() {
            $('#qrcodeDialog').remove();
        });

        // 确认按钮事件
        $('#qrcodeConfirmBtn').on('click', function() {
            let fileInput = $('#qrcodeFileInput')[0];
            if (fileInput.files.length === 0) { 
toastr.error('请选择需要解析的二维码图片！', '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                return;
            }

            let file = fileInput.files[0];
            let reader = new FileReader();
            reader.onload = function(event) {
                let imageData = event.target.result;

                // 创建一个 Canvas 元素，并将图片渲染到 Canvas 上
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                let image = new Image();
                image.onload = function() {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0);

                    // 获取 Canvas 上的图片数据，并解析二维码
                    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    let code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code !== null) {
                        let resultHtml = '<div style="font-size: 16px;">解析结果：' + code.data + '</div>';
                        resultHtml += '<hr>';
                        resultHtml += '<button id="qrcodeCloseBtn" style="float: right;margin-right: 10px;    padding: 2px 5px; font-size: 14px; text-align: center;   color: rgb(255, 255, 255); background-color: rgb(66, 185, 131); border: none;border-radius: 3px; cursor: pointer;">关闭</button>';
                        resultHtml += '<button id="qrcodeCopyBtn" style="float: right; margin-right: 10px;padding: 2px 5px; font-size: 14px; text-align: center;   color: rgb(255, 255, 255); background-color: rgb(66, 185, 131); border: none;border-radius: 3px; cursor: pointer;">复制</button>';
                        $('#qrcodeDialog').html(resultHtml);

                        // 复制按钮事件
                        $('#qrcodeCopyBtn').on('click', function() {
                            let copyText = document.createElement('textarea');
                            copyText.value = code.data;
                            document.body.appendChild(copyText);
                            copyText.select();
                            document.execCommand('copy');
                            document.body.removeChild(copyText);

toastr.success('已复制到剪贴板！', '', { positionClass: 'toast-bottom-right', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
                        });

                        // 关闭按钮事件
                        $('#qrcodeCloseBtn').on('click', function() {
                            $('#qrcodeDialog').remove();
                        });
                    } else { 
toastr.error('未找到二维码！', '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });

                    }
                };
                image.src = imageData;
            };
            reader.readAsDataURL(file);
        });
}
    function ADDqrcode() {

  // 创建关闭按钮并设置样式
  var $closeBtn = $('<button>X</button>').css({
    'position': 'absolute',
    'top': '5px',
    'right': '5px',
    'font-size': '16px',
    'line-height': '20px',
    'cursor': 'pointer',
    'background-color': 'rgb(169 169 169)',
    'border': '1px solid rgb(204, 204, 204)',
    'color': 'aliceblue', 
  });

  // 关闭按钮事件
  $closeBtn.on('click', function() {
    $qrDiv.remove();
  });

  // 创建二维码元素并设置样式
  var $qrDiv = $('<div id="getqrCode"/>').css({
    'position': 'fixed',
    'top': '50%',
    'left': '50%',
    'transform': 'translate(-50%, -50%)',
    'background-color': 'white',
    'border': '1px solid #c5c5c5',
    'padding': '20px',
    'z-index': '9999',
    'border-radius': '10px',
    'text-align': 'center',
  });

  // 将关闭按钮添加到二维码元素
  $qrDiv.append($closeBtn);

  // 创建输入框和确定按钮并添加到二维码元素中
  var $inputWrapper = $('<div/>').css({
    'width': '100%',
    'margin-top': '10px'
  }).appendTo($qrDiv);

  // 创建输入框并设置样式
  var $input = $('<input type="text" placeholder="请输入需要生成的内容"/>').css({
    'width': '100%',
    'padding': '5px',
    'font-size': '16px',
    'border': '1px solid #ccc',
    'border-radius': '3px'
  }).appendTo($inputWrapper);

 
  // 创建确定按钮并设置样式
  var $confirmBtn = $('<button>生成二维码</button>').css({
 
    'padding': '5px 10px',
    'margin-left': '10px',
    'font-size': '16px',
    'text-align': 'center',
    'color': '#fff',
    'background-color': '#42b983',
    'border': 'none',
    'border-radius': '3px',
    'cursor': 'pointer',
    	'margin': '10px', 
  }).on('click', function() {
    var text = $input.val();
    if (text) {
      // 对输入文本进行编码转换
      text = toUtf8(text);
      // 生成自定义的二维码并替换原有的二维码
      $canvas.find('canvas').remove();
      $canvas.qrcode({
        'width': 200,
        'height': 200,
        'text': text
      });
    } else { 
toastr.error('请输入需要生成的内容！', '', { positionClass: 'toast-top-center', showDuration: 300, hideDuration: 1000, timeOut: 3000, extendedTimeOut: 1000, showEasing: 'swing', hideEasing: 'linear', showMethod: 'fadeIn', hideMethod: 'fadeOut' });
    }
  }).appendTo($inputWrapper);


  // 创建确定按钮并设置样式
  var $confirmBtn = $('<button>解析二维码</button>').css({
 
    'padding': '5px 10px',
    'margin-left': '10px',
    'font-size': '16px',
    'text-align': 'center',
    'color': '#fff',
    'background-color': '#42b983',
    'border': 'none',
    'border-radius': '3px',
    'cursor': 'pointer',
    	'margin': '10px', 
  }).on('click', function() {
  	  DECqrcode();
}).appendTo($inputWrapper);  

  // 创建包裹二维码的 canvas 容器
  var $canvas = $('<div/>').css({
    'margin-top': '20px',
    'text-align': 'center'
  }).appendTo($qrDiv);

  // 添加二维码元素到 body 中
  $('body').append($qrDiv);

  // 生成二维码
  $canvas.qrcode({
    'width': 200,
    'height': 200,
    'text': window.location.href
  });
    $canvas.after('<p  style="padding: 10px" >首次打开默认的二维码为当前页面的网址</p>')
 };


    function toUtf8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
 