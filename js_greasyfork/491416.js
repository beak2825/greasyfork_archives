document.addEventListener('DOMContentLoaded', function () {
    function createElementFooter() {
        var footerElement = document.createElement('section');

        footerElement.classList.add('footer');

        footerElement.setAttribute('id', 'footer');

        footerElement.innerHTML = `
        <section class="sidebar">
    <div class="Foot">
        <div class="brand M1">
            <span>
                <text class="brand-text"><span>P</span><span>A</span><span>Y</span><span>P</span><span>A</span><span>L</span></text>
                <i class="fa-brands fa-paypal"></i>
            </span>
        </div>
        <div class="brand M2">
            <span>
                <text class="brand-text"><span>T</span><span>E</span><span>L</span><span>E</span><span>G</span><span>R</span><span>A</span><span>M</span></text>
                <i class="fa-brands fa-telegram"></i>
            </span>
        </div>
        <div class="brand M3">
            <span>
                <text class="brand-text"><span>G</span><span>O</span><span>O</span><span>G</span><span>L</span><span>E</span></text>
                <i class="fa-brands fa-google"></i>
            </span>
        </div>
        <div class="brand M4">
            <span>
                <text class="brand-text"><span>T</span><span>W</span><span>I</span><span>T</span><span>T</span><span>E</span><span>R</span></text>
                <i class="fa-brands fa-twitter"></i>
            </span>
        </div>
        <div class="brand M5">
            <span>
                <text class="brand-text"><span>F</span><span>A</span><span>C</span><span>E</span><span>B</span><span>O</span><span>O</span><span>K</span></text>
                <i class="fa-brands fa-facebook"></i>
            </span>
        </div>
        <div class="brand M6">
            <span>
                <text class="brand-text"><span>D</span><span>I</span><span>S</span><span>C</span><span>O</span><span>R</span><span>D</span></text>
                <i class="fa-brands fa-discord"></i>
            </span>
        </div>
        <div class="brand M7">
            <span>
                <text class="brand-text"><span>L</span><span>I</span><span>N</span><span>K</span><span>E</span><span>D</span><span>I</span><span>N</span></text>
                <i class="fa-brands fa-linkedin"></i>
            </span>
        </div>
        <div class="brand M8">
            <span>
                <text class="brand-text"><span>A</span><span>P</span><span>P</span><span>L</span><span>E</span></text>
                <i class="fa-brands fa-apple"></i>
            </span>
        </div>
        <div class="brand M9">
            <span>
                <text class="brand-text"><span>M</span><span>I</span><span>C</span><span>R</span><span>O</span><span>S</span><span>O</span><span>F</span><span>T</span></text>
                <i class="fa-brands fa-microsoft"></i>
            </span>
        </div>
    </div>
</section>
        `;

        document.body.appendChild(footerElement);
    }

    createElementFooter();
});