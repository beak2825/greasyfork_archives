// ==UserScript==
// @name            baseStyles
// @description    常用的基础 CSS
// @namespace    essence/styles/base
// @version          0.2
// @grant            GM_addStyle
// @license          MIT
// ==/UserScript==

/* 亮色颜色变量 */
/* 参考 https://nextui.org/docs/customization/colors */

GM_addStyle(`
/* 亮色颜色变量 */
/* 参考 https://nextui.org/docs/customization/colors */
:root {
  --essenceX-layout-background: #FFFFFF;
  --essenceX-layout-foreground: #11181C;
  --essenceX-layout-divider: rgba(17, 17, 17, 0.15);
  --essenceX-layout-focus: #006FEE;

  --essenceX-content-1: #FFFFFF;
  --essenceX-content-2: #f4f4f5;
  --essenceX-content-3: #e4e4e7;
  --essenceX-content-4: #d4d4d8;

  --essenceX-default-background: #d4d4d8;
  --essenceX-default-foreground: hsl(0 0% 0%);
  --essenceX-primary-background: #006FEE;
  --essenceX-primary-foreground: hsl(0 0% 100%);
  --essenceX-secondary-background: #7828c8;
  --essenceX-secondary-foreground: hsl(202 24% 9%);
  --essenceX-success-background: #17c964;
  --essenceX-success-foreground: hsl(0 0% 0%);
  --essenceX-warning-background: #f5a524;
  --essenceX-warning-foreground: hsl(0 0% 0%);
  --essenceX-danger-background: #f31260;
  --essenceX-danger-foreground: hsl(0 0% 100%);

  --essenceX-padding-medium: 10px 16px;
  --essenceX-radius-medium: 14px;

  --essenceX-toast-margin: 30px;
  --essenceX-toast-initial-position: 100px;

  --essenceX-font-family: Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

button.essenceX {
  border: none;
  border-radius: var(--essenceX-radius-medium);
  padding: var(--essenceX-padding-medium);
  transition: all 0.3s ease;
}

button.essenceX:active {
  transform: scale(0.95);
}

.default.essenceX {
  background: var(--essenceX-default-background);
  color: var(--essenceX-default-foreground);
}

.primary.essenceX {
  background: var(--essenceX-primary-background);
  color: var(--essenceX-primary-foreground);
}

.success.essenceX {
  background: var(--essenceX-success-background);
  color: var(--essenceX-success-foreground);
}

.warning.essenceX {
  background: var(--essenceX-warning-background);
  color: var(--essenceX-warning-foreground);
}

.danger.essenceX {
  background: var(--essenceX-danger-background);
  color: var(--essenceX-danger-foreground);
}

a.essenceX {
  color: var(--essenceX-primary-background);
  text-decoration: none;
}

a.essenceX:hover {
  color: var(--essenceX-secondary-background);
}

/*************** 布局 ******************/

.flex-row.essenceX {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

/*************** 自定义的面板 ***********/

/* 通知 */
.toast.essenceX {
  position: fixed;
  top: calc(-1 * var(--essenceX-toast-initial-position));
  right: var(--essenceX-toast-margin);
  z-index: 9999;
  padding: var(--essenceX-padding-medium);
  border-radius: var(--essenceX-radius-medium);

  transition: transform 0.5s ease-in-out;
}

.toast.show.essenceX {
  transform: translateY(calc(var(--essenceX-toast-initial-position) + var(--essenceX-toast-margin)));
}

.toast.hide.essenceX {
  /* 因为出现时从上到下出现位移，所以从左到右消失需要指定保持 Y 轴，否则将从右上角消失 */
  transform: translate(100%, calc(var(--essenceX-toast-initial-position) + var(--essenceX-toast-margin)));
}

/* 对话框 */
.dialog.essenceX {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9998;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  background-color: rgba(0, 0, 0, 0.2);

  opacity: 0;
  transform: scale(0);
  /* 过渡效果：缩放和透明度 */
  transition: transform 0.3s, opacity 0.3s;
}

.dialog.show.essenceX {
  opacity: 1;
  transform: scale(1);
}

.dialog-content.essenceX {
  background: var(--essenceX-layout-background);
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  padding: 20px;
  margin-top: 100px;
}

.dialog-header.essenceX {
  font-weight: 600;
  margin-bottom: 20px;
}

.dialog-body.essenceX {
}
`);