// ==UserScript==
// @name         查看评分
// @version      0.2.8
// @include      https://www.mcbbs.net/pinfen
// @author       xmdhs
// @description  查看评分。
// @license MIT
// @namespace    xmdhs.top
// @downloadURL https://update.greasyfork.org/scripts/424437/%E6%9F%A5%E7%9C%8B%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/424437/%E6%9F%A5%E7%9C%8B%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(async function () {
    try {
        await fetch(`https://www.mcbbs.net/?new=no&mobile=no`)
    } catch (error) {
        console.error(error)
    }
    document.write(`<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>查看评分</title>
        <script src="https://static.xmdhs.com/wasm_exec@1.js"></script>
        <link rel="stylesheet" href="https://static.xmdhs.com/style.css">
        <script>let go;
            try {
                go = new Go();
            } catch (error) {
                alert("请更新浏览器")
            }
            async function fetchAndInstantiate() {
                const response = await fetch("https://static.xmdhs.com/pinfen-11.wasm");
                const buffer = await response.arrayBuffer();
                const obj = await WebAssembly.instantiate(buffer, go.importObject)
                go.run(obj.instance);
                document.getElementById('q').removeAttribute("readOnly");
            }
            fetchAndInstantiate();
            function Form(f) {
                let text = document.querySelector("#q").value.toString();
                if (text == "") {
                    return;
                }
                pinfen(text, (v) => {
                    let b = document.createElement("span")
                    b.innerText = v;
                    let a = document.getElementById("text");
                    a.appendChild(b)
                    a.appendChild(document.createElement("br"))
                }, (v) => {
                    document.getElementById("text").innerHTML = '<textarea id="confirmationText" class="text" cols="86" rows="20" name="confirmationText" style="width: 100%;overflow: auto;word-break: break-all;"></textarea>'
                    document.getElementById("confirmationText").value = v;
                    f();
                    let types = {}
                    const data = JSON.parse(v);
                    for (const v of data) {
                        for (const t of v.Link) {
                            types[t.Type] = true;
                        }
                    }
                    document.querySelector("#type").innerHTML = ""
                    for (const v in types) {
                        const dom = document.createElement("option")
                        dom.value = v;
                        dom.innerText = v;
                        document.querySelector("#type").appendChild(dom)
                    }
                    analyze(v)
                }, location.href)
            }
    
            const toanalyze = () => {
                let text = document.querySelector("#confirmationText").value;
                analyze(text)
            }
        
            const analyze = (v) => {
                const type = document.querySelector("#type").value;
                const data = JSON.parse(v);
                const d = []
                for (const a of data) {
                    for (const b of a.Link) {
                        if (b.Type == type) {
                            d.push({
                                Name: b.Name,
                                Uid: b.Uid,
                                Num: b.Num,
                                Text: b.Text,
                                Link: b.Link
                            })
                        }
                    }
                }
                const tempa = {}
                let all = 0
                for (const v of d) {
                    all += v.Num
                    let n = tempa[v.Uid]
                    if (n == undefined) {
                        tempa[v.Uid] = { num: v.Num, uid: v.Uid, name: v.Name }
                    } else {
                        tempa[v.Uid] = { num: v.Num + n.num, uid: v.Uid, name: v.Name }
                    }
                }
                const tempb = []
                for (const c in tempa) {
                    tempb.push(tempa[c])
                }
                tempb.push({ num: all, uid: "all", name: "总和" })
                tempb.sort((a, b) => { return b.num - a.num })
                d.sort((a, b) => { return b.Num - a.Num })
                const s = JSON.stringify(d, null, 4);
                const ss = JSON.stringify(tempb, null, 4);
    
                document.querySelector("#b").value = s;
                document.querySelector("#a").value = ss;
    
                document.querySelector("#c").removeAttribute("style");
            }
        </script>
    </head>
    
    <body>
        <div class="container-lg px-3 my-5 markdown-body">
            <h1>主页</h1>

            <p>因为 mcbbs 关闭了 api，用户脚本版本已失效，请使用软件版本。</p>
            <a href="https://pan.baidu.com/s/1ZtLPh0HvEzD0suXePeWV7A?pwd=xj5u">下载</a>

            <p>总之懒得弄界面，就这样吧</p>
            <p>在下面那个框中输入 uid，然后回车</p>
            <form id="form"><input type="text" id="q" name="q" readonly="readonly" pattern="^\\d+$">
                <input type="submit" value="查询">
            </form>
            <div id="text"></div>
            <div id="c" style="display: none;">
                <select name="type" id="type"></select>
                <textarea id="b" autocomplete=off class="text" cols="86" rows="20" name="confirmationText"
                    style="width: 100%;overflow: auto;word-break: break-all;"></textarea>
                <textarea id="a" autocomplete=off class="text" cols="86" rows="20" name="confirmationText"
                    style="width: 100%;overflow: auto;word-break: break-all;"></textarea>
            </div>
        </div>
    </body>
    
    </html>`)
    document.close();

    var t;
    window.addEventListener("load", () => {
        document.querySelector("#type").addEventListener("change", () => {toanalyze()})
        document.getElementById("form").addEventListener("submit", function (event) {
            event.preventDefault();
            if (!t) {
                t = true;
                Form(() => {
                    t = false;
                });
            } else {
                alert("一次只能查询一个用户")
            }
        })
    })
})();

