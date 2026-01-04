document.addEventListener('DOMContentLoaded', function () {
    const follower = document.createElement('form');
    follower.classList.add('follower');
    document.body.appendChild(follower);

    follower.style.visibility = 'hidden';
    follower.style.position = 'fixed';
    follower.style.pointerEvents = 'none';

    document.body.addEventListener('mousemove', (e) => {
        follower.style.visibility = 'visible';
        follower.style.left = `${e.pageX}px`;
        follower.style.top = `${e.pageY}px`;
        follower.style.transform = 'translate(-50%, -50%)';
    });

    document.body.addEventListener('mouseleave', (e) => {
        follower.style.visibility = 'hidden';
    });

    document.body.addEventListener('click', function (e) {
        if (follower.style.visibility === 'hidden') {
            follower.style.visibility = 'visible';
            follower.style.left = `${e.clientX}px`;
            follower.style.top = `${e.clientY}px`;
            follower.style.transform = 'translate(-50%, -50%)';
        } else {
            follower.style.visibility = 'hidden';
        }
        document.body.addEventListener('mousemove', (e) => {
            follower.style.visibility = 'hidden';
        });

        document.body.addEventListener('click', function (e) {
            if (follower.style.visibility === 'visible') {
                follower.style.visibility = 'hidden';
            }
        });
    });
});