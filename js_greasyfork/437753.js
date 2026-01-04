// ==UserScript==
// @name         sogou_optimizer
// @namespace    https://github.com/Kyouichirou
// @version      1.3
// @description  remove the redirection of url in sogou; block rubbish site or url.
// @author       HLA
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        window.close
// @include      http*
// @run-at       document-idle
// @compatible  chrome; just test on chrome 80+
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/437753/sogou_optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/437753/sogou_optimizer.meta.js
// ==/UserScript==

(() => {
    "use strict";
    const black_keys = [
        "\u674e\u4f73\u7426",
        "\u8587\u5a05",
        "\u8096\u6218",
        "\u89c2\u5bdf\u8005\u7f51",
        "\u4e3b\u64ad",
        "\u7f51\u7ea2",
        "\u7f57\u6c38\u6d69",
        "\u7f57\u632f\u5b87",
        "\u515a\u4e2d\u592e",
        "\u5171\u9752\u56e2",
        "\u79e6\u660a",
        "\u738b\u9a81",
        "\u9a81\u8bdd\u4e00\u4e0b",
        "\u540e\u63f4\u4f1a",
        "\u738b\u4fca\u51ef",
        "\u66fe\u4ed5\u5f3a",
        "\u666e\u4eac",
        "\u7279\u6717\u666e",
        "\u827e\u8dc3\u8fdb",
        "\u8d58\u5a7f",
        "\u4e60\u8fd1\u5e73",
        "\u4e60\u4e3b\u5e2d",
        "\u6bdb\u6cfd\u4e1c",
        "\u6bdb\u4e3b\u5e2d",
        "\u6e29\u94c1\u519b",
        "\u66fe\u4ed5\u5f3a",
        "\u751f\u65e5\u5feb\u4e50",
        "\u5218\u8bd7\u8bd7",
        "\u5c0f\u5a07\u59bb",
        "\u89c2\u89c6\u9891",
        "\u4eba\u6c11\u65e5\u62a5",
        "\u601d\u60f3\u706b\u70ac",
        "\u534a\u4f5b",
        "\u65b0\u534e\u793e",
        "\u5916\u4ea4\u90e8",
        "\u5434\u4ea6\u51e1",
        "\u9e7f\u6657",
        "\u535a\u541b\u4e00\u8096",
        "\u5fd8\u7fa1",
        "\u6613\u70ca\u5343\u73ba",
        "\u5feb\u624b",
        "\u6296\u97f3",
    ];
    const Notification = (
        content = "",
        title = "",
        duration = 2500,
        cfunc,
        ofunc
    ) => {
        GM_notification({
            text: content,
            title: title,
            timeout: duration,
            onclick: cfunc,
            ondone: ofunc,
        });
    };
    const url_tools = {
        table: "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D",
        crc32(str, init = 0) {
            //a number between 0 and 255
            let n = 0;
            //hex number
            let x = 0;
            init = init ^ -1;
            for (const e of str) {
                n = (init ^ e.charCodeAt(0)) & 0xff;
                x = "0x" + this.table.substr(n * 9, 8);
                init = (init >>> 8) ^ x;
            }
            return (init ^ -1).toString(16);
        },
        disassemble(obj) {
            //将除域名部分外的部分URL字符长度超过6的获取crc32, 以减少内存的花费
            const { hostname, href } = obj || location;
            const pathname = href.slice(
                href.indexOf(hostname) + hostname.length + 1
            );
            const p = pathname.length > 6 ? this.crc32(pathname) : pathname;
            const tmp = hostname.split(".");
            const i = tmp.length;
            return tmp.length === 2
                ? ["", hostname, p]
                : [tmp[0], tmp.slice(1, i).join("."), p];
        },
    };
    const menus = {
        m_name: null,
        s_name: null,
        p_name: null,
        get_data(obj) {
            [this.s_name, this.m_name, this.p_name] =
                url_tools.disassemble(obj);
            return GM_getValue(this.m_name);
        },
        set_data(data, mode, content) {
            data === null || data
                ? GM_setValue(this.m_name, data)
                : data === undefined && GM_deleteValue(this.m_name);
            Notification(
                `successfully ${mode ? "add" : "remove"} the ${content} ${
                    mode ? "to" : "from"
                } block list`,
                "tips"
            );
        },
        // 主域名, 有值(不为空), null, undefined, 三者的区别
        host(mode, obj) {
            const data = this.get_data(obj);
            if ((data === undefined && !mode) || (data === null && mode))
                return;
            this.set_data(mode ? null : undefined, mode, "host");
        },
        // 子域名
        sub(mode, obj) {
            let data = this.get_data(obj);
            if (!this.s_name) return;
            let change = false;
            if (data) {
                const tmp = data[this.s_name];
                if (mode) {
                    if (tmp) {
                        data[this.s_name] = null;
                        change = true;
                    } else if (tmp === undefined) {
                        data[this.s_name] = null;
                        change = true;
                    }
                } else if (!mode && tmp !== undefined) {
                    delete data[this.s_name];
                    change = true;
                }
            } else if (!data && mode) {
                if (
                    data === null &&
                    !confirm(
                        "the main host of this url has been block, change the block mode?"
                    )
                )
                    return;
                data = {};
                data[this.s_name] = null;
                change = true;
            }
            change && this.set_data(data, mode, "sub_host");
        },
        // 整个URL
        url(mode, obj) {
            let data = this.get_data(obj);
            if (!this.p_name) return;
            let change = false;
            if (data) {
                // 数据存储在子域名下的数据
                if (this.s_name) {
                    const s = data[this.s_name];
                    if (s && Array.isArray(s)) {
                        const index = s.indexOf(this.p_name);
                        if (index > -1) {
                            if (mode) return;
                            else {
                                s.splice(index, 1);
                                change = true;
                            }
                        } else if (mode) {
                            s.push(this.p_name);
                            change = true;
                        }
                    } else if (s === null && mode) {
                        // 已设置子域名
                        if (
                            !confirm(
                                "the main host of this url has been block, change the block mode?"
                            )
                        )
                            return;
                        data[this.s_name] = [this.p_name];
                        change = true;
                    } else if (s === undefined && mode) {
                        data[this.s_name] = [this.p_name];
                        change = true;
                    }
                } else {
                    // 数据被存储在通用列表
                    const c = data["common_x_list"];
                    if (c && Array.isArray(c)) {
                        const index = c.indexOf(this.p_name);
                        if (index > -1) {
                            if (mode) return;
                            else c.splice(index, 1);
                            change = true;
                        }
                    }
                }
            } else if (mode) {
                // 已设置主域名
                if (
                    data === null &&
                    !confirm(
                        "the main host of this url has been block, change the block mode?"
                    )
                )
                    return;
                data = {};
                if (this.s_name) data[this.s_name] = [this.p_name];
                else data["common_x_list"] = [this.p_name];
                change = true;
            }
            change && this.set_data(data, mode, "url");
        },
        main(index) {
            switch (index) {
                case 0:
                    this.host(true, null);
                    break;
                case 1:
                    this.sub(true, null);
                    break;
                case 2:
                    this.url(true, null);
                    break;
                case 3:
                    this.host(false, null);
                    break;
                case 4:
                    this.sub(false, null);
                    break;
                case 5:
                    this.url(false, null);
                    break;
            }
        },
        a_mid: null,
        a_uid: null,
        a_sid: null,
        r_mid: null,
        r_uid: null,
        r_sid: null,
        create(mode) {
            // 知乎页面只允许添加URL, 但是可以移除m, s, u
            if (!mode) {
                this.a_mid = GM_registerMenuCommand(
                    "a_main",
                    this.main.bind(this, 0)
                );
                this.a_sid = GM_registerMenuCommand(
                    "a_sub",
                    this.main.bind(this, 1)
                );
            }
            this.a_uid = GM_registerMenuCommand(
                "a_url",
                this.main.bind(this, 2)
            );
            this.r_mid = GM_registerMenuCommand(
                "r_main",
                this.main.bind(this, 3)
            );
            this.r_sid = GM_registerMenuCommand(
                "r_sub",
                this.main.bind(this, 4)
            );
            this.r_uid = GM_registerMenuCommand(
                "r_url",
                this.main.bind(this, 5)
            );
        },
    };
    const optimier = {
        create_button(node, index, mode) {
            const button = `
                <button
                    class="filter_button ${index}"
                    title="block this ${mode ? "url" : "site"}"
                >
                    Block
                </button>`;
            node.insertAdjacentHTML("afterend", button);
        },
        create_button_style() {
            const css = `
            button.filter_button{
                opacity: 0.15;
                margin-left: 10px;
            }
            button.filter_button:hover{
                opacity: 1;
                transition: opacity 1s;
            }
            rbblock.rubbish {
                text-decoration-line: line-through;
                color: red;
            }`;
            GM_addStyle(css);
        },
        create_click_event(node) {
            node.addEventListener("click", (e) => {
                const target = e.target;
                if (
                    target.localName === "button" &&
                    target.className.startsWith("filter_button")
                ) {
                    const a = target.previousElementSibling;
                    target.style.display = "none";
                    const mode = this.check_gray_list(a.hostname);
                    mode ? menus.url(true, a) : menus.host(true, a);
                    this.hide_node(a, mode ? 3 : 1);
                }
            });
        },
        // 避免重复获取数据, 改成同步获取数据
        // fetch不支持直接timeout, 需要间接实现, 即设置timeout, 如果超时就abort请求
        // fetch大量的技术协议还处于草案阶段
        async anti_redirect(node, url, index = 0) {
            const controller = new AbortController();
            let timeout_id = setTimeout(() => {
                timeout_id = null;
                controller.abort();
                console.log(`timeout error: ${url}`);
            }, this.options.timeout);
            await fetch(url, { ...this.options, signal: controller.signal })
                .then((res) => {
                    if (timeout_id)
                        clearTimeout(timeout_id), (timeout_id = null);
                    if (res.status === 200) return res.text();
                    else throw new Error(`error, httpCode: ${res.status}`);
                })
                .then((res) => {
                    if (res.slice(0, 50).includes("<!DOCTYPE html>"))
                        throw new Error("There is no final site for this link");
                    else {
                        const ms = res.match(this.configs.content_reg);
                        ms && ms.length > 1
                            ? this.configs.func(node, ms, index, url)
                            : console.log(`no found finalURL in ${url}`);
                    }
                })
                .catch((e) => {
                    timeout_id && clearTimeout(timeout_id);
                    console.log(`some errors in ${url}`);
                    console.log(e);
                });
        },
        options: null,
        configs: null,
        config_setup(mode) {
            // options of running, parameters of funcs
            this.options = {
                method: "GET",
                mode: "cors",
                credentials: "",
                redirect: "error",
                referrer: "no-referrer",
                timeout: 350,
            };
            this.configs = {
                content_reg: null,
                protocol_reg: /^http:/,
                target_id: null,
                content_id: null,
                item_id: null,
                func: null,
            };
            [
                this.configs.content_reg,
                this.options.credentials,
                this.configs.content_id,
                this.configs.target_id,
                this.configs.func,
            ] = mode
                ? [
                      /(?<=\+=\s').+(?=')/g,
                      "same-origin",
                      "news-list",
                      "h3 a[href^='/link?url=']",
                      (...args) => {
                          const href = args[1].join("");
                          args[0].href = href;
                          this.checked_dic[args[3]] = [href, 0];
                      },
                  ]
                : [
                      /window.location.replace\("(.+)"\)/,
                      "omit",
                      "results",
                      "a[href^='/link?url=']",
                      (...args) => {
                          const href = args[1][1];
                          const node = args[0];
                          const text = node.innerText;
                          if (text && this.check_item_text(text)) {
                              this.hide_node(node, 4, href);
                              this.checked_dic[args[3]] = [href, 4];
                              return;
                          }
                          const is_sogou =
                              !href.startsWith("http") &&
                              href.startsWith("/sogou");
                          if (this.check_white_list(href) || is_sogou) {
                              const tmp = is_sogou
                                  ? "https://www.sogou.com" + href
                                  : href;
                              node.href = tmp;
                              this.checked_dic[args[3]] = [tmp, 0];
                          } else {
                              const f = this.check_url(href);
                              if (f) this.hide_node(node, f, href);
                              else {
                                  if (text && !this.is_baidu)
                                      this.create_button(
                                          node,
                                          args[2],
                                          this.check_gray_list(href)
                                      );
                                  node.href = href;
                                  this.is_baidu = href.includes("baidu.");
                              }
                              this.checked_dic[args[3]] = [href, f];
                          }
                      },
                  ];
        },
        hide_node(node, mode = 0, href) {
            // check the item if hide completely
            if (!href) href = node.href;
            let pnode = node.parentNode;
            let c = pnode.className;
            let ci = c;
            let item = node;
            while (c !== "results") {
                item = pnode;
                pnode = pnode.parentNode;
                if (!pnode) return;
                c = pnode.className;
            }
            const links = item.getElementsByTagName("a");
            const i = links.length;
            if (i < 2) {
                item.style.display = "none";
                this.is_hide = true;
            } else {
                const arr = [];
                for (const a of links) {
                    const href = a.href;
                    href && arr.push(href);
                }
                if ((this.is_hide = arr.length < 2 || new Set(arr).size === 1))
                    item.style.display = "none";
                else {
                    if (ci && ci.includes("img")) {
                        let item = node;
                        let p = node.parentNode;
                        ci = p.className;
                        while (ci.includes("img")) {
                            item = p;
                            p = p.parentNode;
                            if (!p) {
                                item = null;
                                break;
                            }
                            ci = p.className;
                        }
                        if (item) {
                            item.style.display = "none";
                            item.innerText = "rubbish block";
                            console.log(`${href}, this block has been hidden`);
                            return;
                        }
                    }
                    this.retset_a_node(node, mode);
                }
            }
            this.is_hide && console.log(`${href}, url has been hidden`);
        },
        retset_a_node(node, mode) {
            node.href = "javascript:void(0);";
            if (node.innerText) {
                const types = ["site", "sub-site", "url", "content"];
                node.innerText = `this ${types[mode - 1]} has been block`;
                node.style.textDecoration = "line-through";
            }
        },
        check_url(href) {
            /*
             check the main host, then the sub_host, last is the whole url
             if no data in sub_host, check the common list
            {
                "baidu.com": {
                    www: ["abc", "123"],
                    news: null,
                }
                "douban.com": {
                    "www": null
                },
                "google.com": null,
                "youku.com": {
                    "common_x_list": ["123", "abc"]
                }
            }
            */
            const [s, m, p] = url_tools.disassemble(new URL(href));
            const data = GM_getValue(m);
            if (data === undefined) return 0;
            else if (data === null) return 1;
            const sub = s ? data[s] : undefined;
            if (sub === null) return 2;
            if (p) {
                if (sub && Array.isArray(sub)) return sub.includes(p) ? 3 : 0;
                const c = data["common_x_list"];
                if (c && Array.isArray(c)) return c.includes(p) ? 3 : 0;
            }
            return 0;
        },
        check_item_text(text) {
            // check the content text
            if (black_keys.length === 0) return false;
            else {
                const arr = black_keys.filter((e) => text.includes(e));
                if (arr.length === 0) return false;
                else {
                    console.log(
                        `the text contains rubbish content, keyword: ${arr.join(
                            ","
                        )}`
                    );
                    return arr;
                }
            }
        },
        get content_node() {
            const content_node = document.getElementsByClassName(
                this.configs.content_id
            );
            return content_node.length > 0 ? content_node[0] : null;
        },
        checked_dic: null,
        is_hide: false,
        is_baidu: false,
        check_c_dic(href, node, index) {
            // chech the requested url
            const data = this.checked_dic[href];
            if (data) {
                if (data[1] === 0) {
                    const href = data[0];
                    node.href = href;
                    if (
                        !this.check_white_list(data[0]) &&
                        node.innerText.length > 0
                    ) {
                        !this.is_baidu &&
                            this.create_button(
                                node,
                                index,
                                this.check_gray_list(data)
                            );
                        this.is_baidu = href.includes("baidu.");
                    }
                } else this.retset_a_node(node, data[1]);
                return true;
            }
            return false;
        },
        replace_key_rubbish(node) {
            const text = node.innerText;
            if (text) {
                const arr = this.check_item_text(text);
                // new RegExp(string, flags);
                if (arr) {
                    const reg = new RegExp("(" + arr.join("|") + ")", "g");
                    const new_html =
                        '<rbblock class="rubbish">rubbish</rbblock>';
                    node.innerHTML = node.innerHTML.replace(reg, new_html);
                }
            }
        },
        async list_items(hostname, mode) {
            // support, weixin, zhihu, sogou three diffrent pages
            // some url are imcomplete
            const content_node = this.content_node;
            if (!content_node) return;
            let index = 0;
            this.checked_dic = {};
            !mode && this.create_button_style();
            for (const item of content_node.children) {
                const nodes = item.querySelectorAll(this.configs.target_id);
                for (const node of nodes) {
                    if (node.style.display === "none") continue;
                    const href = node.href;
                    if (
                        href &&
                        href.length > 60 &&
                        href.includes(hostname) &&
                        !href.includes("sogoucdn.") &&
                        !this.check_c_dic(href, node)
                    )
                        await this.anti_redirect(
                            node,
                            href.replace(this.configs.protocol_reg, "https:"),
                            index
                        );
                    if (this.is_hide) break;
                }
                index++;
                this.is_baidu = false;
                if (this.is_hide) this.is_hide = false;
                else this.replace_key_rubbish(item);
            }
            !mode && this.create_click_event(content_node);
            this.check_c_dic = null;
        },
        check_white_list(url) {
            // white lists, don't allow add those sites to black_list
            const white_list = [
                "weixin.",
                ".sogou.",
                ".bing.",
                ".google.",
                ".so.com",
                "www.baidu.com",
                ".sogoucdn.",
            ];
            return white_list.some((e) => url.includes(e));
        },
        get pre_check() {
            // check if the url contains the rubbish words
            const search = location.search;
            if (search && black_keys.length > 0) {
                const ds = decodeURIComponent(search);
                return black_keys.some((e) => ds.includes(e));
            }
            return false;
        },
        check_gray_list(url) {
            return ["zhihu.", "douban.", "bilibili."].some((e) =>
                url.includes(e)
            );
        },
        start() {
            if (this.pre_check) {
                confirm(
                    "Hey, bro, don't waste your time on rubbish, close the page?"
                ) && window.close();
                console.log(
                    "this js is not running, resources should not be wasted on rubbish"
                );
                return;
            }
            const hostname = location.hostname;
            if (!this.check_white_list(hostname))
                setTimeout(
                    () => menus.create(this.check_gray_list(hostname)),
                    3000
                );
            else {
                const reg =
                    /https:\/\/(www|weixin)\.sogou\.com\/(web|sogou|weixin).+/;
                if (location.href.match(reg)) {
                    const mode = hostname.includes("weixin");
                    this.config_setup(mode);
                    this.list_items(hostname, mode);
                }
            }
        },
    };
    optimier.start();
})();
