// 插入一个触发按钮到页面
const triggerButton = document.createElement('button');
triggerButton.textContent = '查看作业';
triggerButton.style.position = 'fixed'; 
triggerButton.style.bottom = '40px';
triggerButton.style.right = '40px';
triggerButton.style.padding = '10px 20px';
triggerButton.style.fontSize = '16px';
triggerButton.style.cursor = 'pointer';
triggerButton.style.zIndex = '10000';
triggerButton.style.backgroundColor = '#007bff';
triggerButton.style.color = '#fff';
triggerButton.style.border = 'none';
triggerButton.style.borderRadius = '5px';
triggerButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
document.body.appendChild(triggerButton);

// 点击按钮时显示 iframe
triggerButton.addEventListener('click', () => {
  // 检查是否已经存在 iframe，避免重复添加
  if (document.getElementById('hwIframe'))
    return;

  // 创建 iframe 元素
  const iframe = document.createElement('iframe');
  
  iframe.id = 'hwIframe';
  iframe.src = chrome.runtime.getURL('hw.html'); // 插件内页面路径
  iframe.style.position = 'fixed';
  iframe.style.top = '10%';
  iframe.style.left = '10%';
  iframe.style.width = '80%';
  iframe.style.height = '80%';
  iframe.style.border = '2px solid #ccc';
  iframe.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  iframe.style.zIndex = '10001';
  iframe.style.backgroundColor = '#fff';
  
  // 创建关闭按钮
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '关闭';
  closeBtn.style.position = 'fixed';
  closeBtn.style.top = '10%';
  closeBtn.style.right = '10%';
  closeBtn.style.transform = 'translateX(-50%)';
  closeBtn.style.zIndex = '10002';
  closeBtn.style.padding = '5px 10px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.backgroundColor = '#ff4d4f';
  closeBtn.style.color = '#fff';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '5px';
  closeBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  
  // 点击关闭按钮时移除 iframe 和关闭按钮
  closeBtn.addEventListener('click', () => {
    iframe.remove();
    closeBtn.remove();
  });

    // 将 iframe 和关闭按钮插入页面
  document.body.appendChild(iframe);
  document.body.appendChild(closeBtn);
});