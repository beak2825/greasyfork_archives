const createPanel = function () {
  // 创建宿主元素
  const container = document.createElement("div");
  container.id = "scriptSettings";
  // 创建 shadowRoot
  const shadowRoot = container.attachShadow({ mode: "open" });

  // 插入样式和内容
  shadowRoot.innerHTML = `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .float-ball {
      position: fixed;
      right: 10px;
      top: 80%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background: #4a90e2;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .float-ball:hover {
      background: #357abd;
      transform: translateY(-50%) scale(1.1);
    }

    .float-ball.active {
      transform: translateY(-50%) rotate(0deg);
    }

    .menu-panel {
      position: absolute;
      right: 60px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      transform-origin: right center;
      width: 200px;
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    .float-ball.active .menu-panel {
      transform: translateY(-50%) scale(1);
      opacity: 1;
    }

    .menu-item {
      margin: 12px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .switch {
      width: 40px;
      height: 24px;
      background: #ddd;
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .switch.active {
      background: #4a90e2;
    }

    .switch::after {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: all 0.3s ease;
    }

    .switch.active::after {
      left: 18px;
    }

    .input-field {
      width: 100%;
      padding: 6px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s ease;
      box-shadow: inset -1px -1px 1px 0px #357abd8c;
      cursor: pointer;
      caret-color: transparent; /* 隐藏光标 */
    }

    .input-field:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }

    .icon {
      width: 24px;
      height: 24px;
      fill: white;
    }
  </style>

  <div class="float-ball">
    <svg class="icon" viewBox="0 0 24 24">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
    <div class="menu-panel">
      <div class="menu-item">
        <span>点赞</span>
        <div class="switch like-switch"></div>
      </div>
      <div class="menu-item">
        <span>收藏</span>
        <div class="switch collect-switch"></div>
      </div>
      <input type="text" class="input-field" placeholder="粘贴接口地址" />
    </div>
  </div>
`;

  // 获取切换按钮（switch）
  const likeSwitch = shadowRoot.querySelector(".like-switch");
  const collectSwitch = shadowRoot.querySelector(".collect-switch");

  // 初始化按钮状态（status）
  function initializeSwitches() {
    // 从 GM_getValue 获取状态并更新开关状态
    const likeStatus = GM_getValue("likeStatus", false); // 默认值为 false
    const collectStatus = GM_getValue("collectStatus", false); // 默认值为 false

    // 设置初始状态
    if (likeStatus !== null) {
      likeSwitch.classList.toggle("active", likeStatus);
    }

    if (collectStatus !== null) {
      collectSwitch.classList.toggle("active", collectStatus);
    }
  }
  // 绑定切换事件（event）
  likeSwitch.addEventListener("click", (event) => {
    // 阻止点击事件冒泡
    event.stopPropagation();
    const currentStatus = likeSwitch.classList.contains("active");
    const newStatus = !currentStatus;
    // 切换按钮状态
    likeSwitch.classList.toggle("active", newStatus);
    // 保存新的状态到 GM
    GM_setValue("likeStatus", newStatus);
  });
  collectSwitch.addEventListener("click", (event) => {
    // 阻止点击事件冒泡
    event.stopPropagation();
    const currentStatus = collectSwitch.classList.contains("active");
    const newStatus = !currentStatus;
    // 切换按钮状态
    collectSwitch.classList.toggle("active", newStatus);
    // 保存新的状态到 GM
    GM_setValue("collectStatus", newStatus);
  });

  // 初始化页面加载时的状态
  initializeSwitches();

  // 打开或关闭菜单（menu）
  const floatBall = shadowRoot.querySelector(".float-ball");
  // 点击页面其他地方时关闭菜单
  document.addEventListener("click", function () {
    floatBall.classList.remove("active");
  });
  // 点击浮窗显示或隐藏面板
  floatBall.addEventListener("click", function (event) {
    event.stopPropagation(); // 阻止冒泡
    floatBall.classList.toggle("active");
  });

  // 获取 input 元素
  const inputField = shadowRoot.querySelector(".input-field");
  // 设置 URL 默认值（可以从 GM_getValue 获取已存储的 URL）
  const defaultURL = GM_getValue("storedURL", "");
  // 初始化 input 的值
  inputField.value = defaultURL;
  // 绑定点击事件，点击时粘贴剪贴板的 URL 到 input 中
  inputField.addEventListener("click", function (event) {
    event.stopPropagation(); // 阻止冒泡
    // 使用 Clipboard API 来获取剪贴板内容
    navigator.clipboard
      .readText()
      .then((text) => {
        inputField.value = text; // 将剪贴板中的 URL 填充到 input 中
        inputField.dispatchEvent(new Event("input", { bubbles: true }));
      })
      .catch((err) => {
        console.error("无法读取剪贴板内容:", err);
      });
  });
  inputField.addEventListener("input", function () {
    GM_setValue("storedURL", inputField.value); // 存储该 URL
  });

  return container;
};
