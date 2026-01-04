window.onload = (function () {
    let me_t = setInterval(function () {
        urlL = location.href
        if (urlL === 'http://121.40.105.93:8070/Account/Login') {
            try {
                document.querySelector('#LoginName').value = '王贞丰';
                document.querySelector('#Password').value = '123456';
                document.querySelector('.login-button').click();
            } catch (error) {
                location.reload;

            }
        } else if (urlL === 'http://121.40.105.93:8070/Home/Index') {
            try {
                let ifr = document.querySelectorAll("iframe")[1].contentWindow
                let tag = ifr.document.querySelector(".head_tit").tag.textContent
                if (tag === 'PC构件企业 信息化管理系统 - 实时生产监控看板') {
                    clearInterval(me_t)
                }
            } catch (error) {
                document.querySelector("#_easyui_tree_2").click()
                clearInterval(me_t)
            }
        }
    }, 1000);
})
