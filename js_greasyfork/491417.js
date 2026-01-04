document.addEventListener('DOMContentLoaded', function () {
    function createElementSVG() {
        var SVGelement = document.createElement('section');

        SVGelement.classList.add('svg');

        SVGelement.setAttribute('id', 'svg');

        SVGelement.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" version="1.2" width="0" height="0">
    <defs>
        <filter id="header-image-border" x="0" y="0">
            <feImage xlink:href="../static/pictures/SVGHeader.jpg" result="borderPattern" preserveAspectRatio="xMidYMid slice" />
            <feMorphology operator="dilate" radius="50%" % in="SourceAlpha" result="expandedOutline" />
            <feMorphology operator="dilate" radius="25px" in="expandedOutline" result="softenedOutline" />
            <feComposite operator="in" in="borderPattern" in2="softenedOutline" result="borderWithPattern" />
            <feGaussianBlur in="borderWithPattern" stdDeviation="0.25" result="softBorder" />
            <feComposite operator="over" in="softBorder" in2="SourceGraphic" />
        </filter>
        <filter id="text-image-border" x="0" y="0">
            <feImage xlink:href="../static/pictures/SVGText.jpg" result="borderPattern" preserveAspectRatio="xMidYMid slice" />
            <feMorphology operator="dilate" radius="50%" in="SourceAlpha" result="expandedOutline" />
            <feMorphology operator="dilate" radius="25px" in="expandedOutline" result="softenedOutline" />
            <feComposite operator="in" in="borderPattern" in2="softenedOutline" result="borderWithPattern" />
            <feGaussianBlur in="borderWithPattern" stdDeviation="0.25" result="softBorder" />
            <feComposite operator="over" in="softBorder" in2="SourceGraphic" />
        </filter>
    </defs>
</svg>
        `;

        document.body.appendChild(SVGelement);
    }

    createElementSVG();
});