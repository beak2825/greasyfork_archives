// ==UserScript==
// @name         妖火-内容禁止图片、视频
// @namespace    http://tampermonkey.net/
// @version      2024-08--07
// @description  妖火-禁止图片
// @license MIT
// @author       You
// @match        *://yaohuo.me/bbs-*.html*
// @match        *://yaohuo.me*
// @match        *://*.yaohuo.me/*
// @match        *://*.yaohuo.me/bbs-*.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494910/%E5%A6%96%E7%81%AB-%E5%86%85%E5%AE%B9%E7%A6%81%E6%AD%A2%E5%9B%BE%E7%89%87%E3%80%81%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/494910/%E5%A6%96%E7%81%AB-%E5%86%85%E5%AE%B9%E7%A6%81%E6%AD%A2%E5%9B%BE%E7%89%87%E3%80%81%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function () {
    'use strict';

    class ReplaceParentChild {
        constructor(dom) {
            this.url = dom.getAttribute('src');
            this.dom = dom
            this.type = dom.tagName.toLowerCase()
            this.init()
        }
        init() {
            if (this.dom.classList.contains('no-img')) {
                return
            }
            this.replaceDom(this.createDom());
        }
        createDom() {
            // 创建一个 <a> 元素
            const link = document.createElement('a');
            link.href = this.url;
            link.target = '_blank';

            // 创建一个 <img> 元素
            const image = document.createElement('img');
            const videoImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAACgxJREFUeF7tnH1QVNcZxt+zIKkgKEIVJajsh+LEiZPEmqZtMgSZEB1tyoexjRCGONqMKCEGxyo10TZhMhExdoRRa9Ng2rEj7BKbGYtEbdNJY8PUto6NGWeXXQU0gIAaddfI7p7OhTI1Cew5ez84J/Def/aP+973fe7z/Dzcr5EAbmPaATKmzx5PHhCAMQ4BAoAAjHEHxvjp4wqAAIxxB8b46eMKgACMnAMHe3qyZkZF/iiKRNi+CAZjj9ZU225c6R6vVUHB2ue901JSAlr7KMe/sbk8VmufpOnTAs+uX+cN1ae3L+CNIKTv80Cg60YwcDE+IrJzV2fnrjqLpVXr/HCON3QFWH7+fPJ9cRNWPRw9YeWC6GhrYmSk6W5xly5dgsLCQlB+tWzJyclQW1sLyq/WTdGSmZmptQ1kZ2dDRUVF2H16/H5/u7/Pc8Pf1/Ro7MR1YTcI8wBDANj52WfPzouJ/tkTsXFzWXoQguEd6vb7g+du+z7u9Ac2Px0f/wHLSzX7dQVgd1fX07Pviap4Mm6iJRwxCEFot7r8fvjU52uu7uxcWmezXQnHW1atLgAsP3w4Yt2SJ//2WEzsw6yBw+1HCNjOKSvCGZ/3YGbcxCJ2NV+FZgA2ORyrl86//80fmC3RfCOHr0II+Bw8cfPzf++bELegjhDNF76aAFjf2PjyuR07tiuylQuehQsX8p1BiCqEgM/Cq4HAF8+1taW9m5p6ge+IoatUA1Dc1Pj6iZLSTYNtlStwhIAdhdq7g6E6K3cMf+rtXVIwder77Mk6AlByrPHVphdKy7/aEiHgi0FvCD64eXVRbvyUv/JN/3JV2CvApv379x6pqvrpcMMQAr4Y9IRA+XOwoa1t0tupqbf5pv+/KiwAnnK5Uq6vWdPacflyyDkIAV8MekLwL5/X82B0jJlvskoA1r72avfJd36XwDMEIeBxCVQ/MRyq+1s9PdWrEhPDenrIvQIUNzXtPFFSsoHvtAaqEAI+t/RaCbr8fbC2tW223WJx8k0Gvk/CFjudcdHbtl375PRpbmDw7oA3goE6vSA41Nv78TMJCd/lnc4VaFHljo9OHfjNI7xN8e5AnVN6QKA8Nn6+1f1og2XOhzwqmACke/78LVj1Sx/rwo81LCkpCTZu3Ajz589nlTL3d3R0QFlZGSi/WjZFU2VlJSi/WjdFS35+vtY2kJWV1e+Tlu3srVtti+fMmcHTgwnAhl1VHx7dt//7PM1YNXFxcZCWlsYq49rf3d0NbrebqzZUkXKdosdrZGWG8hRT66ttpY/ikeKV2i1h2jRwr14944jV2sbqwQSgqLTUe6qxUfNHG4rJx48fZ+nh2t/c3Nz/HYHWTY8ld1BDQ0MDbNmyRauk/u8a9Hik/tbVnppVkxOLWYJCApDd4ZryafrSTlYT1n4Mn+XQwH69wld6ba/aeXvbS2XMf7ghAdhQWXny6IEDj/PJH7oKw+dzT8/wldWxtb0dvl1bG12XkuILpSAkAEVby52n6uxWvlP4ehWGz+ec3uErfyKVbe3eml+UpGe8ohqA50pfuPVR4zFV7/lHe/jV1dWwZ88evoRDVBkVvjJySXm5vaqgIE81AOkZGcGOy5eZF4pfHTDaw1cu9pSLPq2bkeEr2hY985O26pdfCXk7GDLc9IwMGu79P4bPh4XR4SsqMlau7KrZunWqqhVgsdN5j2fZsrBeL2L48oSvKHkkK8v72927Y9QCEOdZtuw63ykNvPgZzff535Rl/+687nvgAb/90KFxqgC4f8WKeXfOnDnLAwCGz+OSvvf5yq3e4NX+cNNHBAAMX87wFVWGA4Dhyxu+4QBg+HKHbygAGL784RsGAIb/zQhfFwASaPBrdwGTku/lc4Cj6tqldo4qdolemu74fODt7WEPZFRET06AqPHMF3Fcc7y9vXDHF/K/Ghi2T9TkyT3H9u5LVHUb2P8dYAThfg7AdTZYNKIOEAIn61OtixCAEbVdnmEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUYIACLFdnqEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUYIACLFdnqEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUYIACLFdnqEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUYIACLFdnqEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUYIACLFdnqEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUYIACLFdnqEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUYIACLFdnqEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUYIACLFdnqEIgDxZCFGCAAixXZ6hCIA8WQhRggAIsV2eoQiAPFkIUaIJgIKOjhiv9+ZNIcpxqC4OECDv15stT4RqRkLtzHW7ggAQskYXpdjEGAcovGu3WLO1ANAJAFOMUYddR8CBX9vN1jUaAGhpBqDfGQGhOMIYB35uN1tf0wCA6yAAFBijDbsa7oCJ5NlnWeyqAchpcZYSQnYZLhQHGOIA9Qctjtmz3aoBWH7R9VAwAP8wRB02NdgB6rabbRbWEOYVfq7bdREAZrAa4X65HKCU1jgstmKWKjYAnpYqoPRFViPcL5cDhJLMeovlBEsVE4Acp/NBEkFOsxrhfokcoPQTu8U2j0cREwClSa675T0AupSnIdZI4IDJtM4+y1zNo4QLgJwLrsdJEE7yNMQawQ5QaLFbrFZeFVwADKwCzncASD5vY6wT4wABKKw3W5XnN1wbNwA5Tue9JIL8BwAmcnXGohF3gBBoqE+15oQzmBsApWmO211AIMhNVzhCsFazA1f8QXjoiNXaFk6nsABQGue5XZUU4KVwhmCt8Q5QoE85zLY/hjspbAD6VwKP6xCh8ONwh2G9YQ6st5ute9R0VwXA/1aCIxTgh2qG4jE6OkDIZnuq5XW1HVUDMHBn4PoDAKxQOxyP0+YABShzmK07tXTRBABeE2ixXtOxAWIihfWzLL/X1EWvz71y3c58APIrAIjXKgiPZzrwdxqgxQ6b7Z/MSo4CzSvA4IzlHk9SIOivIIQUcczFEhUOUEq3OSy27SoOHfYQ3QAYnJDncn0PTPRFCiRPT6FjuRelsA8ix73hmDkz5McdajzSHYBBEbme82mERqykALkAMFeNuDF+zFkKcBgC9G2HzdZulBeGAXC34OwLF+YSv/8xMMECAnQeADHj18Z3O0SuAaVuMMFZEiTNJDL4l7qZtnNGhf6lySMxZKgZaygdd6WzJZ54TeNFaRA+13T7Tl/UpOvvTZ/uFaVlRFYAUSeHc9kOIABsj0Z1BQIwquNlnxwCwPZoVFcgAKM6XvbJIQBsj0Z1xX8BrkZhzLJVP78AAAAASUVORK5CYII='
            const imageImg = 'data:image/png;base64,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';
            image.src = this.type==='img'?imageImg:videoImg
            // 将 <img> 元素添加到 <a> 元素中
            image.classList.add('no-img');
            image.style.width = '5%';
            image.style.position = 'relative';
            this.addEventListener(image)
            link.appendChild(image);
            return link
        }
        replaceDom(newDom) {
            this.dom.parentNode.replaceChild(newDom, this.dom);
        }
        addEventListener(image) {
            const previewDom = document.querySelector('#image-preview')
            const previewImg = previewDom.querySelector(this.type)
            image.addEventListener('mouseenter',  (e) =>{
                previewDom.querySelector(this.type==='img'?'video':'img').style.display = 'none'
                previewImg.style.display = 'block'
                const offsetLeft = e.target.offsetLeft
                const offsetTop = e.target.offsetTop
                const width = e.target.width

                previewImg.src = this.url;
                //if(this.type==='video'){
                //    previewImg.play();
                //    previewImg.pause();
                //}
                previewDom.style.display = 'block';
                previewDom.style.left = offsetLeft +width/2 + 'px';
                previewDom.style.top = offsetTop - 50 + 'px';
                previewDom.style.transform = 'translate(-50%, -50%)';
                previewDom.style.opacity = 1;
                previewDom.addEventListener('mouseleave', function () {
                    previewDom.style.opacity = 0;
                    previewDom.style.display = 'none';
                });
            })
            image.addEventListener('mouseleave', function (e) {
                 previewDom.style.display = 'none';
            });
        }
    }
    const createImagePreview = ()=>{
        const div = document.createElement('div');
        div.id = 'image-preview';
        div.style.position = 'absolute';
        div.style.zIndex = '999';
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.background = 'white';
        div.style.border = '1px solid #ccc';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 0 5px #ccc';
        div.style.display = 'none';
        div.style.overflow = 'hidden';
        div.style.transition = 'all 0.3s';
        div.style.pointerEvents = 'none';
        div.style.userSelect = 'none';
        const image = document.createElement('img');
        const video = document.createElement('video');
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'contain';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        div.appendChild(image);
        div.appendChild(video);
        document.body.appendChild(div);
    }
    //文章
    const replaceArticle = () => {
        const content = document.querySelector('.bbscontent');
        if (!content) {
            return
        }
        const images = content.querySelectorAll('img');
        images.forEach(function (img) {
            new ReplaceParentChild(img);
        });
        const videos = content.querySelectorAll('video');
        videos.forEach(function (video) {
            new ReplaceParentChild(video);
        });
    }
    //回复、附件
    const replaceReply = () => {
        var content = document.querySelectorAll('.recontent,.content');
        if (!content) {
            return
        }
        content.forEach(function (item) {
            var images = item.querySelectorAll('img');
            images.forEach(function (img) {
                var imgUrl = img.getAttribute('src');
                if (/face\/.*\.gif/gm.test(imgUrl)) {
                    return
                }
                if (/NetImages\/.*\.gif/gm.test(imgUrl)) {
                    return
                }
                new ReplaceParentChild(img);
            });
            const videos = item.querySelectorAll('video');
            videos.forEach(function (video) {
                new ReplaceParentChild(video);
            });
        });

    }

    //去除个人中心头像
    const replaceAvatar = () => {
        var avatarImg = document.querySelector('.touxiang img');
        if (!avatarImg) {
            return
        }
        new ReplaceParentChild(avatarImg);
    }
    createImagePreview()
    replaceArticle()
    replaceReply()
    replaceAvatar()
})();