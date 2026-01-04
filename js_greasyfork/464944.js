/**
 * 默认画笔线宽
 * @type {number}
 */
var defaultStrokeWidth = 1; //画矩形选取框的线宽

/**
 * 选取划线的canvasExt
 * @type {{drawRect: canvasExt.drawRect}}
 */
var canvasExt = {
  /**
   *  画矩形
   * @param canvasId canvasId
   * @param penColor 画笔颜色
   * @param strokeWidth 线宽
   */
  drawRect: function (canvasId, penColor, strokeWidth) {
    var that = this;

    that.penColor = penColor;
    that.penWidth = strokeWidth;
    var canvas = document.getElementById(canvasId);
    //canvas 的矩形框
    var canvasRect = canvas.getBoundingClientRect();
    //canvas 矩形框的左上角坐标
    var canvasLeft = canvasRect.left;
    var canvasTop = canvasRect.top;

    // 要画的矩形的起点 xy
    var x = 0;
    var y = 0;

    //鼠标点击按下事件，画图准备
    canvas.onmousedown = function (e) {

      //设置画笔颜色和宽度
      var color = that.penColor;
      var penWidth = that.penWidth;
      // 确定起点
      x = e.clientX - canvasLeft;
      y = e.clientY - canvasTop;
      // 添加layer
      $("#" + canvasId).addLayer({
        type: 'rectangle',
        strokeStyle: color,
        strokeWidth: penWidth,
        name: 'areaLayer',
        fromCenter: false,
        x: x, y: y,
        width: 1,
        height: 1
      });
      // 绘制
      $("#" + canvasId).drawLayers();
      $("#" + canvasId).saveCanvas();

      //鼠标移动事件，画图
      canvas.onmousemove = function (e) {

        // 要画的矩形的宽高
        var width = e.clientX - canvasLeft - x;
        var height = e.clientY - canvasTop - y;

        // 清除之前画的
        $("#" + canvasId).removeLayer('areaLayer');

        $("#" + canvasId).addLayer({
          type: 'rectangle',
          strokeStyle: color,
          strokeWidth: penWidth,
          name: 'areaLayer',
          fromCenter: false,
          x: x, y: y,
          width: width,
          height: height
        });

        $("#" + canvasId).drawLayers();
      }
    };
    //鼠标抬起
    canvas.onmouseup = function (e) {

      var color = that.penColor;
      var penWidth = that.penWidth;

      canvas.onmousemove = null;

      var width = e.clientX - canvasLeft - x;
      var height = e.clientY - canvasTop - y;

      $("#" + canvasId).removeLayer('areaLayer');

      $("#" + canvasId).addLayer({
        type: 'rectangle',
        strokeStyle: color,
        strokeWidth: penWidth,
        name: 'areaLayer',
        fromCenter: false,
        x: x, y: y,
        width: width,
        height: height
      });

      $("#" + canvasId).drawLayers();
      $("#" + canvasId).saveCanvas();

      // 把body转成canvas
      html2canvas(document.body, {
        scale: 1,
        // allowTaint: true,
        useCORS: true,  //跨域使用
        // foreignObjectRendering: true 
      }).then(canvas => {
        var capture_x, capture_y
        if (width > 0) {
          //从左往右画
          capture_x = x + that.penWidth
        } else {
          //从右往左画
          capture_x = x + width + that.penWidth
        }
        if (height > 0) {
          //从上往下画
          capture_y = y + that.penWidth
        } else {
          //从下往上画
          capture_y = y + height + that.penWidth
        }
        printClip(canvas, capture_x, capture_y, Math.abs(width), Math.abs(height))
      });
      // 移除画的选取框
      $("#" + canvasId).removeLayer('areaLayer');
      // 隐藏用于华画取框的canvas
      $("#" + canvasId).hide()
    }
  }
};

/**
 * 选取截屏
 * @param canvasId
 */
function clipScreenshots(canvasId) {
  canvasExt.drawRect(canvasId, "red", defaultStrokeWidth);
}

/**
 * 打印截取区域
 * @param canvas 截取的canvas
 * @param capture_x 截取的起点x
 * @param capture_y 截取的起点y
 * @param capture_width 截取的起点宽
 * @param capture_height 截取的起点高
 */
function printClip(canvas, capture_x, capture_y, capture_width, capture_height) {
  // 创建一个用于截取的canvas
  var clipCanvas = document.createElement('canvas')
  clipCanvas.width = capture_width
  clipCanvas.height = capture_height
  // 截取
  clipCanvas.getContext('2d').drawImage(canvas, capture_x, capture_y, capture_width, capture_height, 0, 0, capture_width, capture_height)
  var clipImgBase64 = clipCanvas.toDataURL()
  // // 生成图片
  // var clipImg = new Image()
  // clipImg.src = clipImgBase64
  // var con = confirm('打印截图吗?取消则保存截图')
  // if (con) {
  //   $(clipImg).print()
  // } else {
  //   downloadIamge(clipImgBase64)
  // }

  // alert二维码解析内容
  const qrcode = new QRCode.Decoder();
  qrcode
    .scan(clipImgBase64)
    .then(result => {
      console.log(result.data);
      alert(result.data)
    })
    .catch(error => {
      console.error(error);
      alert("出错：" + error)
    });
}

/**
 * 下载保存图片
 * @param imgUrl 图片地址
 */
function downloadIamge(imgUrl) {
  // 图片保存有很多方式，这里使用了一种投机的简单方法。
  // 生成一个a元素
  var a = document.createElement('a')
  // 创建一个单击事件
  var event = new MouseEvent('click')
  // 生成文件名称
  var timestamp = new Date().getTime();
  var name = imgUrl.substring(22, 30) + timestamp + '.png';
  a.download = name
  // 将生成的URL设置为a.href属性
  a.href = imgUrl;
  // 触发a的单击事件 开始下载
  a.dispatchEvent(event);
}

