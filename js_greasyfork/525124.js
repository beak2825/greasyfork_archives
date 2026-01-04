// 创建面板元素
let panel = $("<div>", {
  css: {
    position: "absolute",
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    top: "30%",
    right: "30%",
    zIndex: "9999",
  }
});

// 创建复选框元素
let autoRefuseCkx = $("<input>", {
  type: "checkbox",
  name: "pmpaAutoRefuse",
  value: "pmpaAutoRefuse"
});

// 创建标签元素
let label = $("<label>", {
  for: "pmpaAutoRefuse",
  text: " 自动-我不接受"
});


// 定义定时器任务队列类
class TimerTaskQueue {
  constructor() {
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    try {
      while (this.isRunning) {
        // 第一个事件
        if (!await this.refuseEvt()) {
          break;
        }
        // 第二个事件
        await this.confirmEvt();
        // 第三个事件
        await this.refreshEvt();        
        await new Promise(resolve => setTimeout(resolve, 2000)); 

      }
    } catch {
      
    }
  }

  stop() {
    this.isRunning = false;
  }

  // 第一个事件：点击拒绝按钮，没有则结束任务队列
  refuseEvt() {
    return new Promise(resolve => {
      let isClicked = false; // 用于标记是否已经点击过包含“拒绝”的链接
      $('div[data-testid="beast-core-table"] a').each(function() {
        let linkText = $(this).text();
        if (linkText.includes("拒绝")) {
          if (!isClicked) {
            // 只有在还未点击过的情况下执行点击操作
            $(this).get(0).click();
            console.log("点击了拒绝按钮");
            isClicked = true; // 标记为已经点击过
            resolve(true);
          }
        }
      });
      if (!isClicked) {
        // 如果遍历完所有链接都没有点击过，说明未找到拒绝按钮
        console.log("未找到拒绝按钮，结束任务队列");
        resolve(false);
      }
    });
  }

  // 第二个事件：点击拒绝按钮弹出模态框，随机 2 - 5s 点击确定按钮
  confirmEvt() {
    return new Promise(resolve => {
      const randomTime = getRandomNum(2, 5),
      customLabelTxt = "我不接受",
      refuseBtnTxt = "确认",
      cfmBtnTxt = "确认";

      setTimeout(() => {
        // 全部拒绝
        $('label[data-testid="beast-core-radio"]')
          .filter((_, el) => $(el).text() === customLabelTxt)
          .click();
          
          let textareaEle = $(
            'div[data-testid="beast-core-modal-body"] textarea[data-testid="beast-core-textArea-htmlInput"]:visible'
          );
          if (textareaEle.get(0)) {
            fillFormInput(textareaEle.get(0), getRandomLeftKeyboardChar());
          }

        $('div[data-testid="beast-core-modal"] button')
          .filter((_, el) => $(el).text() === cfmBtnTxt ||$(el).text() === refuseBtnTxt)
          .click();


        console.log(`等待 ${randomTime} 秒后点击了确定按钮`);

        resolve();
      }, randomTime * 1000);
    });
  }

  // 第三个事件：随机等待 5 - 10s 点击刷新按钮
  refreshEvt() {
    return new Promise(resolve => {
      const randomTime = getRandomNum(5, 10);
      const sbtBtnTxt = "查询";
      setTimeout(() => {
        console.log(`等待 ${randomTime} 秒后点击了${sbtBtnTxt}按钮`);

        $('form div[data-testid="beast-core-grid-row"] button')
          .filter((_, el) => $(el).text() === sbtBtnTxt)
          .click();

        resolve();
      }, randomTime * 1000);
    });
  }
}

const taskQueue = new TimerTaskQueue();

autoRefuseCkx.on("change", function() {
  if (this.checked) {
    // GM_setValue("pmpaAutoRefuse", "y");
    // 这里可以添加复选框选中时要执行的其他操作
    taskQueue.start();
  } else {
    // GM_setValue("pmpaAutoRefuse", "n");
    // 这里可以添加复选框取消选中时要执行的其他操作
    taskQueue.stop();
  }
});

// 将复选框和标签添加到面板中
panel.append(autoRefuseCkx).append(label);

// 将面板添加到页面的 body 中
$("body").append(panel);

