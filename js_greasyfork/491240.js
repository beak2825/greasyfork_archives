document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    function handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {

            header.style.transform = 'translateY(-52px)';
        } else {
            if (scrollTop <= 18) {
                header.style.transform = `translateY(${scrollTop - 18}px)`;
            } else {
                header.style.transform = 'translateY(0px)';
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    window.addEventListener('scroll', handleScroll);

    header.style.transform = 'translateY(-16px)';
});