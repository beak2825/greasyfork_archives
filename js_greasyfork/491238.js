document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    overlay.style.position = 'absolute';
    overlay.style.top = '-10vh';
    overlay.style.left = '-10vw';
    overlay.style.width = '120vw';
    overlay.style.height = '420vh';
    overlay.style.backgroundColor = 'black';
    overlay.style.zIndex = '400';

    document.body.addEventListener('mouseover', function () {
        if (overlay) {
            overlay.style.display = 'none';
        }
    });
    document.addEventListener('touchstart', function () {
        if (overlay) {
            overlay.style.display = 'none';
        }
    });
    document.addEventListener('mouseleave', function () {
        if (overlay) {
            overlay.style.display = 'none';
        }
    });
});