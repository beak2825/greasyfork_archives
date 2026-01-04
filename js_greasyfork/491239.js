function adjustScale() {
    const baseWidth = 1000;
    const viewportWidth = window.innerWidth;
    const scale = baseWidth / viewportWidth;


    const body = document.body;
    const home = document.getElementById("Home");

    body.style.transform = `scale(0.${scale})`;
    body.style.transformOrigin = 'top left';
    body.style.width = `100vw`;
    body.style.minHeight = '100vh';
    home.style.position = 'relative';
    home.style.left = '10vw';
    home.style.width = '80vw';
}

window.addEventListener('load', adjustScale);
window.addEventListener('resize', adjustScale);