// ==UserScript==
// @name         LEES
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  try to free your hands and brains!
// @author       GZY
// @match        http://172.16.234.153:10083/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510369/LEES.user.js
// @updateURL https://update.greasyfork.org/scripts/510369/LEES.meta.js
// ==/UserScript==


const username = GM_getValue("username") || ""
const password = GM_getValue("password") || ""

if (location.pathname !== "/login" && document.getElementsByClassName("login").length > 0) {
    location.href = "http://172.16.234.153:10083/login"
}

if (location.pathname === "/") {
    const logoutBtn = $(".logout")[0]
    if (logoutBtn)
        logoutBtn.addEventListener("click", () => {
            GM_setValue("username", "")
            GM_setValue("password", "")
            location.href = "http://172.16.234.153:10083/login"
        })
}


if (location.pathname === "/login") {
    const loginBtn = document.getElementById("login-submit")
    const usernameDom = document.getElementById("username")
    const passwordDom = document.getElementById("password")
    if (username && password) {
        let interval = setInterval(function () {
            let errorDom = document.getElementById("flash_error")
            if (errorDom) {
                clearInterval(interval)
                return
            }
            if (usernameDom && passwordDom) {
                clearInterval(interval)
                usernameDom.value = username
                passwordDom.value = password
                loginBtn.click()
            }
        }, 100)
    } else {
        loginBtn.addEventListener("click", () => {
            GM_setValue('username', usernameDom.value)
            GM_setValue('password', passwordDom.value)
        })
    }

}
if (location.pathname.startsWith("/issues")) {
    let regex = /\d+/g;
    let botNumberDom = document.getElementsByClassName("string_cf cf_13 attribute")
    if (botNumberDom.length > 0) {
        botNumberDom = botNumberDom[0]
        let numberDom = botNumberDom.getElementsByClassName("value")[0]
        //在后面添加按钮
        let botNumber = numberDom.innerText
        const botNumbers = botNumber.match(regex)
        if (botNumbers) {
            for (botNumber of botNumbers) {
                let botNumberBtn = document.createElement("button")
                botNumberBtn.innerText = botNumber
                botNumberBtn.style = "top: 0;background-color: #007bff; color: #fff; left: 10%; border: none; border-radius: 4px; cursor: pointer;height:auto;position: relative;margin-left: 10px;"
                botNumberBtn.type = "button"
                botNumberBtn.className = "botNumberBtn"
                const linkNumber = botNumber
                botNumberBtn.onclick = function () {
                    window.open(`http://172.16.234.154:10008/search?search=${linkNumber}&nav_source=navbar`)
                }
                numberDom.appendChild(botNumberBtn)
            }
        }
    }
    GM_addStyle(
        `
    #search-results {
            list-style: none;
            padding: 0;
            margin: 10px 0 0 0;
        }
        #search-results li {
            padding: 8px;
            border: 1px solid #ccc;
            margin-top: -1px; /* 移除顶部边框重叠 */
            cursor: pointer;
            width: auto;
            font-size: 14px;
        }
        #search-results li:hover {
            background-color: #f0f0f0;
        }
    `
    )


    let link_me_dom;
    let user_object = {}
    let search_index = 0
    let find_name_interval = setInterval(() => {
        if (link_me_dom && link_me_dom.length > 0) {
            console.log(link_me_dom)
            clearInterval(find_name_interval)
            link_me_dom = link_me_dom[0]
            find_all_userID()
            add_input(link_me_dom)
            return
        }
        if (search_index > 5) {
            clearInterval(find_name_interval)
            return
        }
        link_me_dom = document.getElementsByClassName("assign-to-me-link")
        search_index++
    }, 500)

    function find_all_userID() {
        let users_dom = document.getElementById("issue_assigned_to_id")
        for (let i = 0; i < users_dom.length; i++) {
            let user_id = users_dom[i].value
            let user_name = users_dom[i].text
            user_object[user_name] = user_id
        }
    }

    function add_input(link_me_dom) {
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.id = "search-input"
        input.style.width = "100px"
        input.style.border = "1px solid orange"
        input.setAttribute("placeholder", "请输入名字");
        let ul_dom = document.createElement('ul');
        ul_dom.id = "search-results"
        let a_dom = document.createElement("a")
        a_dom.style.marginLeft = "10px"
        a_dom.append(input)
        a_dom.append(ul_dom)
        link_me_dom.before(a_dom)
        var $results = $('#search-results');
        $results.hide();
        $('#search-input').on('input', function () {
            var searchTerm = $(this).val().toLowerCase();
            $results.empty();
            if (searchTerm) {
                for (let name of Object.keys(user_object)) {
                    if (name && name.toLowerCase().indexOf(searchTerm) !== -1) {
                        let user_id = user_object[name];
                        $results.append($('<li>').text(name).on('click', function () {
                            $('#issue_assigned_to_id').val(user_id);
                            $('#search-input').val(name);
                        }));
                    }

                }
                if ($results.children().length > 0) {
                    $results.show();
                } else {
                    $results.hide();
                }
            } else {
                $results.hide();
            }
        }).on('blur', function () {
            setTimeout(function () {
                $results.hide();
            }, 200)
        }).on('focus', function () {
            if ($('#search-input').val().length > 0 && $results.children().length > 0) {
                $results.show();
            }
        });
    }

    //显示图片
    GM_addStyle(
        `
    .modal {
            display: none; /* 初始状态为隐藏 */
            position: fixed;
            z-index: 1000; /* 确保模态窗口位于其他内容之上 */
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto; /* 允许滚动，以防内容超出视口 */
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */
        }

    .modal-content {
            position: relative; /* 相对于模态窗口定位 */
            z-index: 1001; /* 确保内容位于遮罩之上 */
            max-width: 90%; /* 图片最大宽度为模态窗口的90% */
            max-height: 90%; /* 图片最大高度为模态窗口的90% */
            margin: auto; /* 自动外边距，用于水平和垂直居中 */
            overflow: auto;
        }

    .close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: #fff; /* 白色文字 */
            font-size: 30px;
            font-weight: bold;
            cursor: pointer; /* 鼠标悬停时显示为手形 */
        }

    .close:hover,
    .close:focus {
        color: #bbb; /* 鼠标悬停或聚焦时颜色变浅 */
        text-decoration: none; /* 去除下划线 */
    }
    div.modal{
        background: rgba(0, 0, 0, 0.5);
    }
        `
    )

    let largeImage, modal;

    function createModal() {
        // 创建模态窗口的div元素
        modal = document.createElement('div');
        modal.id = 'largeImageModal';
        modal.className = 'modal';
        modal.onclick = function (event) {
            if (event.target === modal) {
                closeModal();
            }
        };
        let closeButton = document.createElement('span');
        closeButton.className = 'close';
        closeButton.innerHTML = '&times;';
        closeButton.style.zIndex = '10000';
        closeButton.onclick = function () {
            closeModal();
        };

        largeImage = document.createElement('img');
        largeImage.className = 'modal-content';
        largeImage.id = 'largeImage';
        largeImage.addEventListener("wheel", zoomImage);


        modal.appendChild(closeButton);
        modal.appendChild(largeImage);
        modal.addEventListener("wheel", (event) => {
            event.preventDefault();
        });
        document.body.appendChild(modal);
    }

    let imgs = document.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
        let parent = imgs[i].parentNode;
        const href = parent.href;
        if (!href) continue;
        const id = href.split("/").pop();
        parent.removeAttribute("href");
        const title = parent.title;
        if (!/\.(png|jpg|jpeg|gif|bmp|tiff|svg)$/i.test(title)) {
            continue;
        }
        const largeImagePath = `/attachments/download/${id}/${title}`
        parent.style.cursor = "pointer";
        parent.onclick = function () {
            showLargeImage(largeImagePath);
        };
    }
    createModal()

    function zoomImage(event) {
        var scale = largeImage.style.transform ? parseFloat(largeImage.style.transform.match(/scale\(([^)]+)\)/)[1]) : 1;
        var zoom = event.deltaY < 0 ? 1.1 : 0.9;
        scale *= zoom;
        scale = Math.min(Math.max(.125, scale), 4);
        largeImage.style.transform = "scale(" + scale + ")";
    }

    function showLargeImage(largeImagePath) {
        largeImage.style.transform = 'scale(1)';
        largeImage.src = largeImagePath;
        modal.style.display = 'flex';
    }

    function closeModal() {
        var modal = document.getElementById("largeImageModal");
        modal.style.display = "none";
    }
}

const projects_root = $("#quick-search")[0]
const formDom = projects_root.getElementsByTagName("form")[0]
const pathList = formDom.attributes.action.value.split('/')
let input = document.createElement("input")
input.type = "text"
input.placeholder = "请输入机台编号"
input.style.width = "150px"
input.style.marginRight = "5px"
input.style.float = "left"
input.class = "small"

// 监听input的回车事件
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        let base_url = 'http://172.16.234.153:10083'
        if (pathList.length > 2) {
            let path = pathList.slice(0, 3).join('/')
            base_url += path
        }
        location.href = `${base_url}/issues?utf8=%E2%9C%93&set_filter=1&sort=id%3Adesc&f%5B%5D=status_id&op%5Bstatus_id%5D=o&f%5B%5D=cf_13&op%5Bcf_13%5D=%7E&v%5Bcf_13%5D%5B%5D=${input.value}&f%5B%5D=&c%5B%5D=project&c%5B%5D=cf_13&c%5B%5D=cf_64&c%5B%5D=tracker&c%5B%5D=subject&c%5B%5D=priority&c%5B%5D=start_date&c%5B%5D=author&c%5B%5D=status&c%5B%5D=cf_17&group_by=&t%5B%5D=`
        input.value = ""
    }
});

projects_root.children[0].before(input)