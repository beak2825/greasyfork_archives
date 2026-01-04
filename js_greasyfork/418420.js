/**
 * getVaptchaCode v1.0
 * @author Jixun<https://jixun.moe/>
 * @license BSD-3-Clause
 */

function getVaptchaCode(frameURL, container) {
    return new Promise((resolve) => {
        const {origin} = new URL(frameURL);
        const id = 'id' + Date.now() + Math.random();
        const frame = document.createElement('iframe');
        frame.style.transition = 'opacity 1s 1s';
        frame.style.opacity = 1;

        const eventHandler = (event) => {
            if (event.data.vaptcha === id) {
                resolve(event.data.token);
                window.removeEventListener('message', eventHandler);
                frame.style.opacity = 0;

                // Remove iframe after fadeout effects.
                setTimeout(() => {
                    if (frame.parentNode) {
                        frame.parentNode.removeChild(frame);
                    }
                }, 1000);
            }
        };

        window.addEventListener('message', eventHandler);

        frame.src = frameURL;
        frame.onload = () => {
            frame.contentWindow.postMessage({ vaptcha: 'init', id }, origin);
        };
        container.appendChild(frame);
    });
}