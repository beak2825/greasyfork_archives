// ==UserScript==
// @name             [SNOLAB] Alt + i to invert color of Images / Videos Color
// @name:zh-CN       [SNOLAB] Alt + i 反转图片/视频颜色
// @name:es          [SNOLAB] Alt + i para invertir el color de imágenes/videos
// @name:fr          [SNOLAB] Alt + i pour inverser la couleur des images/vidéos
// @name:ru          [SNOLAB] Alt + i для инвертирования цвета изображений/видео
// @name:ar          [SNOLAB] Alt + i لعكس ألوان الصور/الفيديوهات
// @namespace        snomiao@gmail.com
// @version          1.1.0
// @description      Invert page color by Alt+i, combo with Ctrl+Windows+C to invert the color of whole screen, you can enjoy the real night mode in windows.
// @description:zh-CN 按 Alt+i 反转页面颜色，配合 Ctrl+Windows+C 反转整个屏幕颜色，享受真正的夜间模式。
// @description:es   Invierte el color de la página con Alt+i, combina con Ctrl+Windows+C para invertir el color de toda la pantalla, puedes disfrutar del modo nocturno real en Windows.
// @description:fr   Inversez la couleur de la page avec Alt+i, combinez avec Ctrl+Windows+C pour inverser la couleur de tout l'écran, profitez du vrai mode nuit sous Windows.
// @description:ru   Инвертируйте цвет страницы с помощью Alt+i, комбинируйте с Ctrl+Windows+C для инвертирования цвета всего экрана, наслаждайтесь настоящим ночным режимом в Windows.
// @description:ar   اعكس ألوان الصفحة بـ Alt+i، ادمج مع Ctrl+Windows+C لعكس ألوان الشاشة بالكامل، استمتع بالوضع الليلي الحقيقي في Windows.
// @author           snomiao@gmail.com
// @match            *://*/*
// @contributionURL  https://snomiao.com/donate
// @supportURL       https://github.com/snomiao/media-color-invert/issues
// @grant            GM.getValue
// @grant            GM.setValue
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/528816/%5BSNOLAB%5D%20Alt%20%2B%20i%20to%20invert%20color%20of%20Images%20%20Videos%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/528816/%5BSNOLAB%5D%20Alt%20%2B%20i%20to%20invert%20color%20of%20Images%20%20Videos%20Color.meta.js
// ==/UserScript==

main();
function main() {
  const ac = new AbortController();
  globalThis.MediaColorInvert?.abort();
  globalThis.MediaColorInvert = ac;

  const signal = ac.signal;
  // watch
  const debouncedScan = debounce(scan, 8); // Adjust the delay (300ms) as needed
  scan();
  // new MutationObserver((mutationList, observer) => {
  //   mutationList.forEach((mutation) =>
  //     mutation.addedNodes.forEach((e) => scan(e))
  //   );
  // }).observe(document.body, { subtree: true, childList: true });
  window.addEventListener("focus", () => scan(), { signal });

  // toggle
  window.addEventListener("keydown", (e) => isAltI(e) && toggle(), { signal });
}

async function toggle() {
  await setInvert(!(await getInvert()));
  await scan();
}
async function scan() {
  const invert = await getInvert();
  const textNode = document.createTextNode(`
.body{
filter: hue-rotate(180deg);
}
video,img{
filter: invert(1);
}
svg:not(:has(svg)){
filter: hue-rotate(180deg);
}
`);
  const style = document.createElement("style");
  style.appendChild(textNode);
  style.id = "media-color-invert";
  const s = document.head?.querySelector("&>#media-color-invert");

  if (s && !invert) s.remove();
  if (!s && invert) document.head.appendChild(style);
}

async function getInvert() {
  return (await globalThis.GM?.getValue("media-color-invert")) ?? false;
}
async function setInvert(i) {
  return await globalThis.GM?.setValue("media-color-invert", i);
}

function isAltI(e) {
  return e.altKey && !e.metaKey && !e.shiftKey && !e.ctrlKey && e.code === "KeyI";
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}
