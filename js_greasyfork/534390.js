//revised from https://gist.github.com/p1coderblog/24cdae9fa923193f45f3583c2265161d
;

function enableImageResizeInDiv(editor) {
    if (!editor) {
        return
    }
    // firefox valid
    /*if (!(/chrome/i.test(navigator.userAgent) && /google/i.test(window.navigator.vendor))) {
        return;
    }*/
    //const editor = document.getElementById(id);
    let resizing = false;
    let currentImage;
    const createDOM = function (elementType, className, styles) {
        let ele = document.createElement(elementType);
        ele.className = className;
        setStyle(ele, styles);
        return ele;
    };
    const setStyle = function (ele, styles) {
        for (let key in styles) {
            ele.style[key] = styles[key];
        }
        return ele;
    };
    const removeResizeFrame = function () {
        document.querySelectorAll(".resize-frame,.resizer").forEach((item) => item.parentNode.removeChild(item));
    };
    const offset = function offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
    };
    const append = (img, dom) => {
        const next = img.nextElementSibling;
        next ? img.parentElement.insertBefore(dom, next) : img.parentElement.append(dom)
    }
    const clickImage = function (img) {
        removeResizeFrame();
        currentImage = img;
        const imgHeight = img.offsetHeight;
        const imgWidth = img.offsetWidth;
        const imgPosition = {top: img.offsetTop, left: img.offsetLeft};
        const editorScrollTop = img.parentElement.scrollTop;
        const editorScrollLeft = img.parentElement.scrollLeft;
        const top = imgPosition.top - editorScrollTop - 1;
        const left = imgPosition.left - editorScrollLeft - 1;


        append(currentImage, createDOM('span', 'resize-frame', {
            margin: '10px',
            position: 'absolute',
            top: (top + imgHeight - 10) + 'px',
            left: (left + imgWidth - 10) + 'px',
            border: 'solid 3px blue',
            width: '6px',
            height: '6px',
            cursor: 'se-resize',
            zIndex: 1
        }));

        append(currentImage, createDOM('span', 'resizer top-border', {
            position: 'absolute',
            top: (top) + 'px',
            left: (left) + 'px',
            border: 'dashed 1px grey',
            width: imgWidth + 'px',
            height: '0px'
        }));

        append(currentImage, createDOM('span', 'resizer left-border', {
            position: 'absolute',
            top: (top) + 'px',
            left: (left) + 'px',
            border: 'dashed 1px grey',
            width: '0px',
            height: imgHeight + 'px'
        }));

        append(currentImage, createDOM('span', 'resizer right-border', {
            position: 'absolute',
            top: (top) + 'px',
            left: (left + imgWidth) + 'px',
            border: 'dashed 1px grey',
            width: '0px',
            height: imgHeight + 'px'
        }));

        append(currentImage, createDOM('span', 'resizer bottom-border', {
            position: 'absolute',
            top: (top + imgHeight) + 'px',
            left: (left) + 'px',
            border: 'dashed 1px grey',
            width: imgWidth + 'px',
            height: '0px'
        }));

        document.querySelector('.resize-frame').onmousedown = () => {
            resizing = true;
            return false;
        };

        editor.onmouseup = () => {
            if (resizing) {
                //const newHeight = document.querySelector('.left-border').offsetHeight;
                //resize equal ratio
                const width = document.querySelector('.top-border').offsetWidth;
                if (currentImage.parentElement.style.width !== 'auto' && currentImage.parentElement.style.width < width + 'px') {
                    currentImage.parentElement.style.width = 'auto'
                }
                currentImage.style.width = width + 'px';
                //currentImage.style.height = 'auto';
                refresh();
                currentImage.click();
                resizing = false;
            }
        };

        editor.onmousemove = (e) => {
            if (currentImage && resizing) {
                let height = e.pageY - offset(currentImage).top;
                let width = e.pageX - offset(currentImage).left;
                height = height < 1 ? 1 : height;
                width = width < 1 ? 1 : width;
                const top = imgPosition.top - editorScrollTop - 1;
                const left = imgPosition.left - editorScrollLeft - 1;
                setStyle(document.querySelector('.resize-frame'), {
                    top: (top + height - 10) + 'px',
                    left: (left + width - 10) + "px"
                });

                setStyle(document.querySelector('.top-border'), {width: width + "px"});
                setStyle(document.querySelector('.left-border'), {height: height + "px"});
                setStyle(document.querySelector('.right-border'), {
                    left: (left + width) + 'px',
                    height: height + "px"
                });
                setStyle(document.querySelector('.bottom-border'), {
                    top: (top + height) + 'px',
                    width: width + "px"
                });
            }
            return false;
        };
    };
    const bindClickListener = function () {
        editor.querySelectorAll('img').forEach((img) => {
            img.onclick = (e) => {
                if (e.target === img) {
                    clickImage(img);
                }
            };
        });
    };
    const refresh = function () {
        bindClickListener();
        removeResizeFrame();
        if (!currentImage) {
            return;
        }
        const img = currentImage;
        const imgHeight = img.offsetHeight;
        const imgWidth = img.offsetWidth;
        const imgPosition = {top: img.offsetTop, left: img.offsetLeft};
        const editorScrollTop = img.parentElement.scrollTop;
        const editorScrollLeft = img.parentElement.scrollLeft;
        const top = imgPosition.top - editorScrollTop - 1;
        const left = imgPosition.left - editorScrollLeft - 1;

        append(img, createDOM('span', 'resize-frame', {
            position: 'absolute',
            top: (top + imgHeight) + 'px',
            left: (left + imgWidth) + 'px',
            border: 'solid 2px red',
            width: '6px',
            height: '6px',
            cursor: 'se-resize',
            zIndex: 1
        }));

        append(img, createDOM('span', 'resizer', {
            position: 'absolute',
            top: (top) + 'px',
            left: (left) + 'px',
            border: 'dashed 1px grey',
            width: imgWidth + 'px',
            height: '0px'
        }));

        append(img, createDOM('span', 'resizer', {
            position: 'absolute',
            top: (top) + 'px',
            left: (left + imgWidth) + 'px',
            border: 'dashed 1px grey',
            width: '0px',
            height: imgHeight + 'px'
        }));

        append(img, createDOM('span', 'resizer', {
            position: 'absolute',
            top: (top + imgHeight) + 'px',
            left: (left) + 'px',
            border: 'dashed 1px grey',
            width: imgWidth + 'px',
            height: '0px'
        }));
    };
    const reset = function () {
        if (currentImage != null) {
            currentImage = null;
            resizing = false;
            removeResizeFrame();
        }
        bindClickListener();
    };

    editor.addEventListener('scroll', function () {
        reset();
    }, false);
    editor.addEventListener('mouseup', function (e) {
        if (!resizing) {
            const x = (e.x) ? e.x : e.clientX;
            const y = (e.y) ? e.y : e.clientY;
            let mouseUpElement = document.elementFromPoint(x, y);
            if (mouseUpElement) {
                let matchingElement = null;
                if (mouseUpElement.tagName === 'IMG') {
                    matchingElement = mouseUpElement;
                }
                if (!matchingElement) {
                    reset();
                } else {
                    clickImage(matchingElement);
                }
            }
        }
    });
}
