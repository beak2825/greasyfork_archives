document.documentElement.addEventListener('click', function () {
    const currentState = document.body.style.overflowY;

    if (currentState === 'hidden' || currentState === '') {
        document.documentElement.style.overflowY = 'auto';
    } else {
        document.documentElement.style.overflowY = 'auto';
    }
});