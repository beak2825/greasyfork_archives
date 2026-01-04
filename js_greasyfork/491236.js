            $(document).ready(function () {
                let videoPlayed = false;

                $(document.documentElement).on('click', function () {
                    if (!videoPlayed) {
                        const video = $('#CTVideo').get(0);
                        video.loop = false;

                        $('.TextIndex .Content').css('visibility', 'hidden');
                        $('.HeaderIndex .Content').css({
                            'visibility': 'visible',
                            'background-image': "url('https://i.ibb.co/dtgjpLb/360-F-309301133-Fe-VFk-Jxwrg-Zmj-SWQ0-HWEu1n-F3l6-ZMCq5999.jpg')",
                            '-webkit-background-clip': 'text',
                            'background-clip': 'text',
                            'color': 'transparent',
                            '-webkit-text-stroke': '2px rgba(1, 1, 1, 1)',
                            'background-size': 'cover',
                            'background-origin': 'initial',
                            'filter': 'none'
                        });
                        $(video).on('ended', function () {
                            $('.TextIndex .Content').css({
                                'visibility': 'visible',
                                'background-image': "url('https://i.ibb.co/dtgjpLb/360-F-309301133-Fe-VFk-Jxwrg-Zmj-SWQ0-HWEu1n-F3l6-ZMCq5999.jpg')",
                                '-webkit-background-clip': 'text',
                                'background-clip': 'text',
                                'color': 'transparent',
                                '-webkit-text-stroke': '1.2px rgba(1, 1, 1, 1)',
                                'background-size': 'cover',
                                'background-origin': 'initial',
                                'filter': 'none',
                            });
                        });

                        video.play();
                        videoPlayed = true;
                    }
                });
            });