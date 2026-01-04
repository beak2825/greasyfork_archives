// ==UserScript==
// @name        PlayCanvas Editor API Extension
// @name:ja     PlayCanvas Editor API拡張
// @namespace   https://playcanvas.com/editor/scene/1636573
// @match       https://playcanvas.com/editor/scene/*
// @grant       none
// @version     1.0
// @author      yushimatenjin
// @description Load as a script extension under Editor in the Asset List. The @namespace link is a sample project.
// @description:ja 「Assets」→「Editor」ファイルの下にあるスクリプトを拡張機能としてロードします。@namespaceのサンプルプロジェクトを御覧ください。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458152/PlayCanvas%20Editor%20API%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/458152/PlayCanvas%20Editor%20API%20Extension.meta.js
// ==/UserScript==


(function() {
  // Assetsのフォルダ一覧からEditor以下のJavaScriptファイルを拡張として読み込みます
  const importExtensionsFromAssets = () => {
    const extentionsFolder = editor.assets.list().find((data) => {
      const { type, name, path } = data.json();
      return type === "folder" && name === "Editor" && path.length === 0;
    });

    if (!extentionsFolder) {
      console.warn("Create an Editor folder in the assets.");
      return;
    }

    const extentions = editor.assets.list().filter((data) => {
      const { path, type } = data.json();
      return path[0] === extentionsFolder.json().id && type === "script";
    });

    extentions.forEach((data) => {
      const { url } = data.json().file;
      var script = document.createElement("script");
      script.src = url;
      console.log(url)
      document.head.appendChild(script);
    });
  };

   editor.on('assets:load', () => importExtensionsFromAssets());
})();
