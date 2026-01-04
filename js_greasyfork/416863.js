// ==UserScript==
// @name        NGA x Saraba1st Smiles
// @namespace   https://greasyfork.org/users/263018
// @version     1.1.4
// @author      snyssss
// @description 狗叔，咱们有自己的论坛了

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/416863/NGA%20x%20Saraba1st%20Smiles.user.js
// @updateURL https://update.greasyfork.org/scripts/416863/NGA%20x%20Saraba1st%20Smiles.meta.js
// ==/UserScript==

((ui, poster) => {
  if (!ui) return;
  if (!poster) return;

  const hookFunction = (object, functionName, callback) => {
    ((originalFunction) => {
      object[functionName] = function () {
        const returnValue = originalFunction.apply(this, arguments);

        callback.apply(this, [returnValue, originalFunction, arguments]);

        return returnValue;
      };
    })(object[functionName]);
  };

  const smiles = [
    [
      "麻将",
      [
        "./mon_202011/26/-9lddQ5-ga9hK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-18dlK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-7ymuK0Sw-w.gif",
        "./mon_202011/26/-9lddQ5-dtlrK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jmfjK2Sw-w.gif",
        "./mon_202011/26/-9lddQ5-57p6K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bvn7K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jeaeK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-4y0mK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bwgvK2S12-w.gif",
        "./mon_202011/26/-9lddQ5-jbw3K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-6y0rK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-cmumK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-icanK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-3eklK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bk1dK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-hj2hK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-21htK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-7oc9K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-dn7aK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-k91uK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-4y43K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bszeK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-hrc1K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2j95K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-8ge1K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-eqmxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-kpz5K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-4n7iK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-akkzK0Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-9yu9K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ga6xK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-tzyK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-78i4K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-dot4K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jf0iK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-47cmK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ati2K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-fz6rK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-laiaK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-5r2bK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bhmbK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ho52K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-1artK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-6pr7K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bmh9K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-hrpuK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2lw1K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-90wpK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-estbK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jv2mK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-3sfoK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-9e5hK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-feezK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-lbsaK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-50bqK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-av8vK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-gi6iK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-iefK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-6rbjK0Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-3uK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-69lsK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-cfdrK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-hwm9K4T8Sw-w.gif",
        "./mon_202011/26/-9lddQ5-2mavK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-87fpK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-eirbK0S10-x.png",
        "./mon_202011/26/-9lddQ5-k0t5K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-4p0uK1S10-y.gif",
        "./mon_202011/26/-9lddQ5-bf27K1S10-x.gif",
        "./mon_202011/26/-9lddQ5-gtjxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2ncbK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-8evwK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-e1mvK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-kghcK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-6213K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-chfbK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ix46K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-3o6kK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-anv6K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-h6hxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2xh1K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-9rhkK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-gm72K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-20f1K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-aaieK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-h6dwK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-1lngK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-7u18K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-e2ljK1Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-bkqdK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-hitfK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-23kkK0S14-10.png",
        "./mon_202011/26/-9lddQ5-dl5bK1S1j-1c.png",
        "./mon_202011/26/-9lddQ5-v1nK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-gnt0K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-eyt2K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-8qqsK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-frefK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jh6vK2Sw-w.gif",
        "./mon_202011/26/-9lddQ5-iv4jKbT8Sw-w.gif",
        "./mon_202011/26/-9lddQ5-d5c7K5T8Sw-w.gif",
        "./mon_202011/26/-9lddQ5-jsihK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-467aK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-gxnuK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ai3tK0Sq-w.png",
        "./mon_202011/26/-9lddQ5-dwt7K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-b578K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-1oncK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bzhdK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-em4cK0Sw-14.png",
        "./mon_202011/26/-9lddQ5-8e3dK1Sw-14.png",
        "./mon_202011/26/-9lddQ5-9ujxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jticK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-1u7xK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-268hK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-cbq1K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-1o9lK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-hesqK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-e5awK0Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-istjK0Sy-14.png",
        "./mon_202011/26/-9lddQ5-kzq9K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-5fvtK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-fgymK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-l0uzK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-d9fdK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2bkfK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-4as6K7T8Sw-z.gif",
        "./mon_202011/26/-9lddQ5-dkn2K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-341uK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-k3kvK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-gnigK2Sw-w.gif",
        "./mon_202011/26/-9lddQ5-h39uK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-cl00K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-54i3K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-htnyK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-8uxmK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-1daK0Sw-w.gif",
        "./mon_202011/26/-9lddQ5-b0qkK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-212jK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-gf6uK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-9kp7K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-5nc1K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-5ze4K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-8vz7K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-eckxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-e3dhK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-asxzK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-8p4nK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2v9nK0Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-2d4tK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-apb3K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2n6fK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2n4fK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-47g8K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ablrK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-evp3K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-l0oqK1Sw-w.gif",
        "./mon_202011/26/-9lddQ5-7ikzK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-bhe1K0S18-w.png",
        "./mon_202011/26/-9lddQ5-6k33K0S12-w.png",
        "./mon_202011/26/-9lddQ5-j4ihK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bct3K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2byqK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-dpp8K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-cgj7K0Sw-12.png",
        "./mon_202011/26/-9lddQ5-5pv8K0Sz-w.png",
        "./mon_202011/26/-9lddQ5-7bs3K0S12-w.png",
        "./mon_202011/26/-9lddQ5-jwadK0S12-12.png",
        "./mon_202011/26/-9lddQ5-9ccsK0S12-w.png",
        "./mon_202011/26/-9lddQ5-kuuyK0S12-16.png",
        "./mon_202011/26/-9lddQ5-af09K0S12-w.png",
        "./mon_202011/26/-9lddQ5-27cfK0S12-w.png",
        "./mon_202011/26/-9lddQ5-8buhK0S12-w.png",
        "./mon_202011/26/-9lddQ5-2bihK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-huv9K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-fekuK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-daxrK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-64uoK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jvk5K0Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-cyvrK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-6dk1K0Sw-x.png",
        "./mon_202011/26/-9lddQ5-kprxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-btueK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-5mukK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-j6wwK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-emybK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-70neK5T8S16-u.gif",
        "./mon_202011/26/-9lddQ5-1ln9K0S12-16.png",
        "./mon_202011/26/-9lddQ5-ds6cK0Sw-w.gif",
        "./mon_202011/26/-9lddQ5-kjcqK1Sw-w.gif",
        "./mon_202011/26/-9lddQ5-c421K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ilvK1Sw-w.gif",
        "./mon_202011/26/-9lddQ5-bwplK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-h20cK0Sy-10.png",
        "./mon_202011/26/-9lddQ5-l3g6K1Sy-10.png",
        "./mon_202011/26/-9lddQ5-86b4K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-g1rxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-go7fK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ikb0K1Sw-w.gif",
        "./mon_202011/26/-9lddQ5-8iizK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-kxprK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-l5q1K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-8xjnK1S10-17.png",
        "./mon_202011/26/-9lddQ5-izreK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-6yjbK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-curmK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ih7kK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-53wwK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-fuflK0Sw-z.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-428aK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-fudaK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-gukK1S1c-10.png",
        "./mon_202011/26/-9lddQ5-7kfsK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-80gsK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-3m1eK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ka7rK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2m74K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-7sk4K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-d6trK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-h8b0K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-b670K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ftzxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-1pzdK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-6yprK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-caa2K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-hwnxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-7v2rK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2n1qK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-bpp0K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-gfvoK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-kaubK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-8a1oKhT8S18-18.gif",
        "./mon_202011/26/-9lddQ5-cuzeK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-itlyK1S10-14.png",
        "./mon_202011/26/-9lddQ5-olzK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-7r6yK7T8S16-t.gif",
        "./mon_202011/26/-9lddQ5-bgn0K2S1f-1b.gif",
        "./mon_202011/26/-9lddQ5-ekg3K2S1f-1b.gif",
        "./mon_202011/26/-9lddQ5-kzbcK2S1j-12.gif",
      ],
      [
        "./mon_202011/26/-9lddQ5-6eujK2S1j-18.gif",
        "./mon_202011/26/-9lddQ5-c93kK8T8S1j-18.gif",
        "./mon_202011/26/-9lddQ5-i81zK7T8S1j-18.gif",
        "./mon_202011/26/-9lddQ5-5s5vK4T8Sw-z.gif",
        "./mon_202011/26/-9lddQ5-e1n1KcT8Sw-w.gif",
        "./mon_202011/26/-9lddQ5-kq85K1S11-14.gif",
        "./mon_202011/26/-9lddQ5-8b7zK1Sx-10.png",
        "./mon_202011/26/-9lddQ5-hpxmK1Sx-10.png",
        "./mon_202011/26/-9lddQ5-6e81K3Sw-11.gif",
        "./mon_202011/26/-9lddQ5-cbjtK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-g9qyK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-167pK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-7453K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-erzpK3S14-12.gif",
        "./mon_202011/26/-9lddQ5-g7lmK3Sw-14.gif",
        "./mon_202011/26/-9lddQ5-88o7K1Sw-z.png",
        "./mon_202011/26/-9lddQ5-73ynK0Sw-w.png",
      ],
      [
        "./mon_202105/27/-9lddQ2o-9f2hK0Sw-w.png",
        "./mon_202105/27/-9lddQ2o-ku8sK0Sw-w.png",
      ]
    ],
    [
      "角色",
      [
        "./mon_202011/26/-9lddQ5-dp6K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-9u7qK0S10-y.png",
        "./mon_202011/26/-9lddQ5-j408K1Sw-10.png",
        "./mon_202011/26/-9lddQ5-yt8K1Sy-12.png",
        "./mon_202011/26/-9lddQ5-k7szK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-gnwK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-bwmwK1Sw-11.png",
        "./mon_202011/26/-9lddQ5-229yK1Sy-11.png",
        "./mon_202011/26/-9lddQ5-8nr0K1Sy-10.png",
        "./mon_202011/26/-9lddQ5-49ukK1Sw-x.png",
        "./mon_202011/26/-9lddQ5-hk3rK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-1v65K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-9kloK0S12-11.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-f5roK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-e187K1S10-y.png",
        "./mon_202011/26/-9lddQ5-gub3K1Sw-12.png",
        "./mon_202011/26/-9lddQ5-j9m9K2S14-w.gif",
        "./mon_202011/26/-9lddQ5-fmgaK1Sy-1a.png",
        "./mon_202011/26/-9lddQ5-jcg9K2S14-13.gif",
        "./mon_202011/26/-9lddQ5-2j1cK1S14-17.png",
        "./mon_202011/26/-9lddQ5-2wvqK1S14-17.png",
        "./mon_202011/26/-9lddQ5-b1sxK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-48wvK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-dcpyK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-twnK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-9mveK1Sz-y.png",
        "./mon_202011/26/-9lddQ5-hdtuK1Sy-y.png",
        "./mon_202011/26/-9lddQ5-deoyK1Sy-y.png",
        "./mon_202011/26/-9lddQ5-uwfK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-ahasK1S10-13.png",
        "./mon_202011/26/-9lddQ5-aqirK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-khr4K1Sw-14.png",
        "./mon_202011/26/-9lddQ5-8pszK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-hguqK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-i3kwK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-6hbiK0Sy-y.png",
        "./mon_202011/26/-9lddQ5-gh22K0Sw-y.png",
        "./mon_202011/26/-9lddQ5-6llvK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-5bndK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-bqinK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-j1zjK1Sy-12.png",
        "./mon_202011/26/-9lddQ5-66f7K1Sy-12.png",
        "./mon_202011/26/-9lddQ5-a80eK1Sy-12.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-ad3rK1Sy-12.png",
        "./mon_202011/26/-9lddQ5-g45vK1Sw-z.png",
        "./mon_202011/26/-9lddQ5-j6lzK1Sw-z.png",
        "./mon_202011/26/-9lddQ5-5lm8K1Sw-z.png",
        "./mon_202011/26/-9lddQ5-acb2K1Sx-10.png",
        "./mon_202011/26/-9lddQ5-edg5K1Sw-10.png",
        "./mon_202011/26/-9lddQ5-hqxgK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-28viK1S10-10.gif",
        "./mon_202011/26/-9lddQ5-4zpzK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-9ac6K1Sw-z.png",
        "./mon_202011/26/-9lddQ5-cvkmK1Sw-1c.png",
        "./mon_202011/26/-9lddQ5-fn51K1Sw-z.png",
        "./mon_202011/26/-9lddQ5-hzbwK1Sw-z.png",
        "./mon_202011/26/-9lddQ5-lrqK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-4g03K1Sw-y.png",
        "./mon_202011/26/-9lddQ5-8ooaK0Sw-10.png",
        "./mon_202011/26/-9lddQ5-bzs2K0Sy-w.png",
        "./mon_202011/26/-9lddQ5-hk0nK1Sy-w.png",
        "./mon_202011/26/-9lddQ5-20jK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-i9s0K1S10-y.png",
        "./mon_202011/26/-9lddQ5-lc4kK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-8kksK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-b2asK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-e9wrK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-gvppK1Sy-11.png",
        "./mon_202011/26/-9lddQ5-jebfK1S12-10.png",
        "./mon_202011/26/-9lddQ5-1augK0Sw-10.png",
        "./mon_202011/26/-9lddQ5-4uisK1Sy-14.png",
        "./mon_202011/26/-9lddQ5-9bhzK1Sw-13.png",
        "./mon_202011/26/-9lddQ5-553zK1Sw-10.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-15huK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-4djsK1Sw-13.png",
        "./mon_202011/26/-9lddQ5-97fgK1Sw-14.png",
        "./mon_202011/26/-9lddQ5-cawgK1Sw-18.png",
        "./mon_202011/26/-9lddQ5-gas1K1Sw-18.png",
        "./mon_202011/26/-9lddQ5-hyczK1S12-18.png",
        "./mon_202011/26/-9lddQ5-3mf2K1Sw-y.png",
        "./mon_202011/26/-9lddQ5-6aruK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-9zw4K1Sw-z.png",
        "./mon_202011/26/-9lddQ5-cujeK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-f0zlK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-icy1K1Sy-10.png",
        "./mon_202011/26/-9lddQ5-6eipK1Sy-14.png",
        "./mon_202011/26/-9lddQ5-affsK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-csaqK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-gru6K0Sw-y.png",
        "./mon_202011/26/-9lddQ5-k4jtK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-2q1fK1Sy-14.png",
        "./mon_202011/26/-9lddQ5-5jimK1S1c-14.gif",
        "./mon_202011/26/-9lddQ5-9pybK2S1c-14.gif",
        "./mon_202011/26/-9lddQ5-cgj8K2S10-10.gif",
        "./mon_202011/26/-9lddQ5-h8bdK3S1e-18.gif",
        "./mon_202011/26/-9lddQ5-k86xK3S10-1a.gif",
        "./mon_202011/26/-9lddQ5-zw3K1S12-12.gif",
        "./mon_202011/26/-9lddQ5-5jjnK3S14-1a.gif",
        "./mon_202011/26/-9lddQ5-8pvjK5T8S19-1a.gif",
        "./mon_202011/26/-9lddQ5-c7dvK1Sw-10.gif",
        "./mon_202011/26/-9lddQ5-eyg6K1Sy-16.png",
        "./mon_202011/26/-9lddQ5-hr06K1Sy-16.png",
        "./mon_202011/26/-9lddQ5-gdvhK1Sw-12.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-fir8K1Sw-12.png",
        "./mon_202011/26/-9lddQ5-10ghK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-3khdK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-8lnaK1Sw-x.png",
        "./mon_202011/26/-9lddQ5-au9sK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-f5mqK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jtjwK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-xdnK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-597bK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-8uwfK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-geo8K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-juijK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-jimdK4T8Sy-10.gif",
        "./mon_202011/26/-9lddQ5-1yegK1S16-10.png",
        "./mon_202011/26/-9lddQ5-4twvK0Sy-y.png",
        "./mon_202011/26/-9lddQ5-a60pK0Sy-y.png",
        "./mon_202011/26/-9lddQ5-3sjwK1S1c-1e.png",
        "./mon_202011/26/-9lddQ5-cgn5K0Sw-10.png",
        "./mon_202011/26/-9lddQ5-9feoK1Sw-14.png",
        "./mon_202011/26/-9lddQ5-hpgK0Sw-13.png",
        "./mon_202011/26/-9lddQ5-8846K1Sy-13.png",
        "./mon_202011/26/-9lddQ5-jjq1K0Sw-z.png",
        "./mon_202011/26/-9lddQ5-2vjuK1Sw-x.png",
        "./mon_202011/26/-9lddQ5-cnl2K0Sy-10.png",
        "./mon_202011/26/-9lddQ5-hy49K0Sy-10.png",
        "./mon_202011/26/-9lddQ5-15dfK0Sy-12.png",
        "./mon_202011/26/-9lddQ5-bls0K0Sy-12.png",
        "./mon_202011/26/-9lddQ5-kpa1K1Sw-11.png",
        "./mon_202011/26/-9lddQ5-987vK1Sw-11.png",
        "./mon_202011/26/-9lddQ5-gmlyK0Sw-11.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-8rxdK1S14-18.png",
        "./mon_202011/26/-9lddQ5-dq5rK0Sw-14.png",
        "./mon_202011/26/-9lddQ5-h16xK1Sw-14.png",
        "./mon_202011/26/-9lddQ5-vhkK0Sw-14.png",
        "./mon_202011/26/-9lddQ5-csxfK1Sw-14.png",
        "./mon_202011/26/-9lddQ5-a65vK1S12-11.png",
        "./mon_202011/26/-9lddQ5-e9k1K1S12-11.png",
        "./mon_202011/26/-9lddQ5-jc8yK1S12-11.png",
        "./mon_202011/26/-9lddQ5-37q8K1S14-14.png",
        "./mon_202011/26/-9lddQ5-7owaK1Sw-15.png",
        "./mon_202011/26/-9lddQ5-e7s5K1Sw-15.png",
        "./mon_202011/26/-9lddQ5-iq1rK1S12-15.png",
        "./mon_202011/26/-9lddQ5-1jhlK1S12-15.png",
        "./mon_202011/26/-9lddQ5-almaK0Sy-11.png",
        "./mon_202011/26/-9lddQ5-dr9lK0Sy-11.png",
        "./mon_202011/26/-9lddQ5-hg9xK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-sr5K1Sy-11.png",
        "./mon_202011/26/-9lddQ5-dqszK1Sy-11.png",
        "./mon_202011/26/-9lddQ5-kqoaK1Sy-11.png",
        "./mon_202011/26/-9lddQ5-2qgeK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-6dacK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-blszK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-4hn0K1S12-16.png",
        "./mon_202011/26/-9lddQ5-ai87K1S12-11.png",
        "./mon_202011/26/-9lddQ5-dkh4K1S18-14.png",
        "./mon_202011/26/-9lddQ5-gfkhK2S17-1d.gif",
        "./mon_202011/26/-9lddQ5-e2orK2S17-1d.gif",
        "./mon_202011/26/-9lddQ5-idmsK0St-13.png",
        "./mon_202011/26/-9lddQ5-2iqeK0St-13.png",
        "./mon_202011/26/-9lddQ5-66zjK0St-13.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-b4stK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-e43qK0Sw-10.png",
        "./mon_202011/26/-9lddQ5-ied4K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-1t6nK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-8ow6K1Sw-10.png",
        "./mon_202011/26/-9lddQ5-howlK1Sw-y.gif",
        "./mon_202011/26/-9lddQ5-3j2qK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-cgafK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-ksz1K1S10-12.png",
        "./mon_202011/26/-9lddQ5-6424K1S10-12.png",
        "./mon_202011/26/-9lddQ5-d7oaK1S10-12.png",
        "./mon_202011/26/-9lddQ5-c2vwK1S10-12.png",
        "./mon_202011/26/-9lddQ5-60ecK1S10-12.png",
        "./mon_202011/26/-9lddQ5-ihwcK1S10-12.png",
        "./mon_202011/26/-9lddQ5-cvuuK1S10-12.png",
        "./mon_202011/26/-9lddQ5-6d0vK1S10-12.png",
        "./mon_202011/26/-9lddQ5-65exK1S10-12.png",
        "./mon_202011/26/-9lddQ5-bv3K1S10-12.png",
        "./mon_202011/26/-9lddQ5-5hmgK1S10-12.png",
        "./mon_202011/26/-9lddQ5-7hi3K1Sy-16.png",
        "./mon_202011/26/-9lddQ5-gqevK1Sy-16.png",
        "./mon_202011/26/-9lddQ5-bakrK0Sw-14.png",
        "./mon_202011/26/-9lddQ5-jwzcK1Sw-1q.png",
        "./mon_202011/26/-9lddQ5-93h0K1S12-12.png",
        "./mon_202011/26/-9lddQ5-iv2xK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-d2zhK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-1xbwK0Sw-12.png",
        "./mon_202011/26/-9lddQ5-ebhfK1Sw-14.png",
        "./mon_202011/26/-9lddQ5-2dyyK0S12-16.png",
        "./mon_202011/26/-9lddQ5-c878K1S16-1a.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-2hkwK1Sw-y.png",
        "./mon_202011/26/-9lddQ5-bx4yK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-kybjK1S10-12.png",
        "./mon_202011/26/-9lddQ5-btrkK1Sy-13.png",
        "./mon_202011/26/-9lddQ5-5kjeK1Sy-14.png",
        "./mon_202011/26/-9lddQ5-emouK1Sy-14.png",
        "./mon_202011/26/-9lddQ5-34x7K1Sy-1a.png",
        "./mon_202011/26/-9lddQ5-cgkhK1S10-10.png",
        "./mon_202011/26/-9lddQ5-1002K1Sy-10.png",
        "./mon_202011/26/-9lddQ5-i8hsK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-673aK1Su-12.png",
        "./mon_202011/26/-9lddQ5-ernjK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-g7faK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-4lohK1S12-17.png",
        "./mon_202011/26/-9lddQ5-e15gK0Sw-w.gif",
        "./mon_202011/26/-9lddQ5-7q5hK1Sy-14.png",
        "./mon_202011/26/-9lddQ5-gvacK1S10-14.png",
        "./mon_202011/26/-9lddQ5-53p6K1S10-14.png",
        "./mon_202011/26/-9lddQ5-f35lK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-2h7kK0Sw-10.png",
        "./mon_202011/26/-9lddQ5-8ogcK1S11-14.png",
        "./mon_202011/26/-9lddQ5-hlbvK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-6op8K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-abemK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jzrfK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-82g6K1S17-17.png",
        "./mon_202011/26/-9lddQ5-80ogK1S12-10.gif",
        "./mon_202011/26/-9lddQ5-aa5yK1S12-10.png",
        "./mon_202011/26/-9lddQ5-jumjK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-7r97K1S12-y.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-fz78K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-4n2pK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-ecanK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-dll6K1Sw-10.png",
        "./mon_202011/26/-9lddQ5-ero6K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-xxmK1S10-14.png",
        "./mon_202011/26/-9lddQ5-ajmyK1S10-15.png",
        "./mon_202011/26/-9lddQ5-kg5qK1Sy-14.png",
        "./mon_202011/26/-9lddQ5-9566K1Sy-14.png",
        "./mon_202011/26/-9lddQ5-iyjjK1Sy-14.png",
        "./mon_202011/26/-9lddQ5-58owK1S10-14.png",
        "./mon_202011/26/-9lddQ5-7292K1S12-10.png",
        "./mon_202011/26/-9lddQ5-hb3oK1S10-1e.png",
        "./mon_202011/26/-9lddQ5-azqtK1S14-1a.png",
        "./mon_202011/26/-9lddQ5-cmwbK1S14-16.png",
        "./mon_202011/26/-9lddQ5-odtK1Sw-x.png",
        "./mon_202011/26/-9lddQ5-9udtK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-cqzcK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-f2j0K1Sy-y.png",
        "./mon_202011/26/-9lddQ5-4sznK1S10-14.png",
        "./mon_202011/26/-9lddQ5-eyrhK1S14-14.png",
        "./mon_202011/26/-9lddQ5-39veK1Sy-14.gif",
        "./mon_202011/26/-9lddQ5-ctt3K1Sy-14.png",
        "./mon_202011/26/-9lddQ5-107sK1S14-14.png",
        "./mon_202011/26/-9lddQ5-b8jiK1S14-14.png",
        "./mon_202011/26/-9lddQ5-cfy2K1S14-14.png",
        "./mon_202011/26/-9lddQ5-1ul6K1S14-14.png",
        "./mon_202011/26/-9lddQ5-375aK1S10-14.png",
        "./mon_202011/26/-9lddQ5-db2zK1S10-14.png",
        "./mon_202011/26/-9lddQ5-1lauK3S10-16.gif",
      ],
      [
        "./mon_202011/26/-9lddQ5-1au8K4T8S15-16.gif",
        "./mon_202011/26/-9lddQ5-bgocK4T8S15-16.gif",
        "./mon_202011/26/-9lddQ5-k697K1S12-1e.png",
        "./mon_202011/26/-9lddQ5-97paK1S14-19.png",
        "./mon_202011/26/-9lddQ5-j6w0K1S14-1e.png",
        "./mon_202011/26/-9lddQ5-bsjzK1S13-18.png",
        "./mon_202011/26/-9lddQ5-42rK1S13-18.png",
        "./mon_202011/26/-9lddQ5-9xfjK1S13-18.png",
        "./mon_202011/26/-9lddQ5-jdzhK1S18-1e.png",
        "./mon_202011/26/-9lddQ5-8jcxK1Sy-1a.png",
        "./mon_202011/26/-9lddQ5-ipezK1Sy-1a.png",
        "./mon_202011/26/-9lddQ5-7327K1Sy-1c.png",
        "./mon_202011/26/-9lddQ5-gn9aK2S10-16.png",
        "./mon_202011/26/-9lddQ5-4t0pK1S10-16.png",
        "./mon_202011/26/-9lddQ5-7823K1S16-18.png",
        "./mon_202011/26/-9lddQ5-4jkaK1S16-18.png",
        "./mon_202011/26/-9lddQ5-a28oK1S10-18.png",
        "./mon_202011/26/-9lddQ5-l9m2K1S10-10.png",
        "./mon_202011/26/-9lddQ5-aj62K1Sw-y.png",
        "./mon_202011/26/-9lddQ5-keibK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-99atK1Sw-18.png",
        "./mon_202011/26/-9lddQ5-ejo9K1Sw-18.png",
        "./mon_202011/26/-9lddQ5-2yhcK1S10-1c.png",
        "./mon_202011/26/-9lddQ5-380wK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-cuk0K1Sw-12.png",
        "./mon_202011/26/-9lddQ5-1k2sK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-ji5vK1S14-12.png",
        "./mon_202011/26/-9lddQ5-7z09K1S14-12.png",
        "./mon_202011/26/-9lddQ5-i7huK2S14-12.gif",
        "./mon_202011/26/-9lddQ5-620oK1Sw-1i.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-6doxK1Sw-z.png",
        "./mon_202011/26/-9lddQ5-gfffK1Su-10.png",
        "./mon_202011/26/-9lddQ5-4ufcK0Su-11.png",
        "./mon_202011/26/-9lddQ5-el4bK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-48k9K0Sw-y.png",
        "./mon_202011/26/-9lddQ5-el5pK1Sx-y.png",
        "./mon_202011/26/-9lddQ5-309hK4T8S34-32.png",
        "./mon_202011/26/-9lddQ5-de8tK0Ss-w.png",
        "./mon_202011/26/-9lddQ5-1zr0K7T8S14-14.gif",
        "./mon_202011/26/-9lddQ5-ar83K1S19-10.gif",
        "./mon_202011/26/-9lddQ5-kmi7K1S10-13.png",
        "./mon_202011/26/-9lddQ5-lbywK1Sy-12.png",
        "./mon_202011/26/-9lddQ5-9mpbK1Sy-10.png",
        "./mon_202011/26/-9lddQ5-jcmqK1Sy-10.png",
        "./mon_202011/26/-9lddQ5-7xysK3Sw-14.gif",
        "./mon_202011/26/-9lddQ5-gqknK0Sw-10.png",
        "./mon_202011/26/-9lddQ5-8rxaK3Sw-12.gif",
        "./mon_202011/26/-9lddQ5-gw90K1S10-14.png",
        "./mon_202011/26/-9lddQ5-426oK1Sy-12.png",
        "./mon_202011/26/-9lddQ5-heyaK1S10-14.png",
        "./mon_202011/26/-9lddQ5-25m2K0Sw-10.png",
        "./mon_202011/26/-9lddQ5-c08kK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-bjsK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-2lsvK3Sw-w.gif",
        "./mon_202011/26/-9lddQ5-7f2sK1Sy-12.png",
        "./mon_202011/26/-9lddQ5-cp1bK0Sw-13.png",
        "./mon_202011/26/-9lddQ5-upbK0Sw-1d.png",
        "./mon_202011/26/-9lddQ5-a4toK3Sw-y.gif",
        "./mon_202011/26/-9lddQ5-1acbK1Sz-y.png",
        "./mon_202011/26/-9lddQ5-4j4fK1Sw-y.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-a8qiK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-5pm8K1S12-1k.png",
        "./mon_202011/26/-9lddQ5-eipgK1S10-16.png",
        "./mon_202011/26/-9lddQ5-28plK0Sw-14.png",
        "./mon_202011/26/-9lddQ5-bog6K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-lcc0K1Sy-12.png",
        "./mon_202011/26/-9lddQ5-8gtcK0Sw-z.png",
        "./mon_202011/26/-9lddQ5-ht9zK0Sw-z.png",
        "./mon_202011/26/-9lddQ5-5ax2K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-5n1zK1Sx-14.png",
        "./mon_202011/26/-9lddQ5-ddpaK0Sw-16.png",
        "./mon_202011/26/-9lddQ5-ejfsK1Sy-16.png",
        "./mon_202011/26/-9lddQ5-4if0K1S12-14.png",
        "./mon_202011/26/-9lddQ5-e2mfK1S10-14.png",
        "./mon_202011/26/-9lddQ5-kz6dK1Sy-11.png",
        "./mon_202011/26/-9lddQ5-2wfaK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-cj27K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ik4K0Sw-z.png",
        "./mon_202011/26/-9lddQ5-9mmbK0S10-z.png",
        "./mon_202011/26/-9lddQ5-igm6K1Sw-x.png",
        "./mon_202011/26/-9lddQ5-61q3K1S16-1c.png",
        "./mon_202011/26/-9lddQ5-ighoK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-bp98K1S12-18.png",
        "./mon_202011/26/-9lddQ5-9s5K1Sw-17.png",
        "./mon_202011/26/-9lddQ5-kn08K1S1e-10.png",
        "./mon_202011/26/-9lddQ5-7m2rK1S12-1b.png",
        "./mon_202011/26/-9lddQ5-gga7K0Sw-18.gif",
        "./mon_202011/26/-9lddQ5-47p8K1Sy-12.png",
        "./mon_202011/26/-9lddQ5-8eafK1S10-13.png",
        "./mon_202011/26/-9lddQ5-gun7K1S10-11.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-y7pK1Sy-11.png",
        "./mon_202011/26/-9lddQ5-inwyKeT8S14-18.gif",
        "./mon_202011/26/-9lddQ5-6lmaK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-g3kqK1Sw-14.png",
        "./mon_202011/26/-9lddQ5-6fu7K1S1c-12.png",
      ],
      [
        "./mon_202105/27/-9lddQ2o-ekkqK1Sw-10.png",
        "./mon_202105/27/-9lddQ2o-1g3sK1S10-18.png",
        "./mon_202105/27/-9lddQ2o-dav0K1Sz-11.png",
        "./mon_202105/27/-9lddQ2o-kfg8K1Sw-z.png",
      ]
    ],
    [
      "动物",
      [
        "./mon_202011/26/-9lddQ5-e97hK1Sw-12.png",
        "./mon_202011/26/-9lddQ5-1g80K1Sw-12.png",
        "./mon_202011/26/-9lddQ5-bewkK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-kw3pK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-kkb9K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-7t6qK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-gs6xK0Sw-13.png",
        "./mon_202011/26/-9lddQ5-4goaK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-kejeK0Sw-y.png",
        "./mon_202011/26/-9lddQ5-femlK1Sw-11.png",
        "./mon_202011/26/-9lddQ5-47b5K1Sw-10.png",
        "./mon_202011/26/-9lddQ5-crv3K0Sw-10.png",
        "./mon_202011/26/-9lddQ5-4ke5K0Sw-11.png",
        "./mon_202011/26/-9lddQ5-dda7K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-170yK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-amrqK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-bzykK1Sz-11.png",
        "./mon_202011/26/-9lddQ5-l44gK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-9knoK1Sw-11.png",
        "./mon_202011/26/-9lddQ5-iruoK1Sw-11.png",
        "./mon_202011/26/-9lddQ5-6c2jK1Sx-10.png",
        "./mon_202011/26/-9lddQ5-gcboK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-5307K0Sw-12.png",
        "./mon_202011/26/-9lddQ5-9v1cK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-a58uK1Sw-y.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-gxxqK1Sw-z.png",
        "./mon_202011/26/-9lddQ5-4il9K1Sw-14.png",
        "./mon_202011/26/-9lddQ5-c0tlK1Sw-w.png",
      ],
      [
        "./mon_202105/27/-9lddQ2o-57a5K1S16-1c.png",
        "./mon_202105/27/-9lddQ2o-gz1mK0Sw-u.png",
      ]
    ],
    [
      "硬件",
      [
        "./mon_202011/26/-9lddQ5-ld2cK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-5dwqK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-k4lwK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-88byK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-hwc7K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-5xxyK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-9zlrK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-238xK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-a2j5K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-i7noK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-4o5tK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-d9oyK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-hexK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-9upkK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ab9oK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-jhqvK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-7xasK1Sw-12.gif",
        "./mon_202011/26/-9lddQ5-g91sK0S10-w.png",
        "./mon_202011/26/-9lddQ5-4iezK0S10-w.png",
        "./mon_202011/26/-9lddQ5-e9gnK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-faeK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-98muK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-itd9K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-serK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-9opdK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-j989K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-59s2K0Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-cjnbK0Sw-16.png",
        "./mon_202011/26/-9lddQ5-ij83K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-cp84K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-9m1vK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-ivu7K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-6evrK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-fb7fK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-23ojK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-a4v0K0Sw-x.png",
        "./mon_202011/26/-9lddQ5-islaK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-18hmK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-cwoxK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-au8jK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-4ydsK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-eygtK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-aeznK0Sw-x.png",
        "./mon_202011/26/-9lddQ5-jdouK0Sw-x.png",
      ],
    ],
    [
      "白鹅",
      [
        "./mon_202011/26/-9lddQ5-8hnkK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-g18pK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-4rn9K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-60f5K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-reyK0Sy-w.png",
        "./mon_202011/26/-9lddQ5-as2xK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-8r5kK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-3yjwK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-d8vxK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-1dteK0Sx-14.png",
        "./mon_202011/26/-9lddQ5-goqcK0Sw-14.png",
        "./mon_202011/26/-9lddQ5-5xelK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-fxmrK1Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-frzrK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-432jK1S12-11.png",
        "./mon_202011/26/-9lddQ5-dtocK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-lc5dK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-dkwbK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-6ffaK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-hk7pK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-dj9tK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-kf9xK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-9zpqK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-6gkcK1Sz-z.png",
        "./mon_202011/26/-9lddQ5-g7e6K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-436lK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-j2x1K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-ehy8K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-fmq8K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-a6ldK0Sw-z.png",
        "./mon_202011/26/-9lddQ5-cbv0K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-3v9pK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-cuzhK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-dr3zK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-9f9iK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-54jzK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-1fthK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-ab22K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-5kdiK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-feo8K2T8S1q-1s.png",
        "./mon_202011/26/-9lddQ5-6j1eK2S18-18.png",
        "./mon_202011/26/-9lddQ5-doimK0S14-w.png",
        "./mon_202011/26/-9lddQ5-ck3K1Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-co05K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-f5n9K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-gii1K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-hujoK0Sy-w.png",
        "./mon_202011/26/-9lddQ5-5mu9K0Sy-w.png",
        "./mon_202011/26/-9lddQ5-d2yvK1S12-11.png",
        "./mon_202011/26/-9lddQ5-iof5K0Sy-y.png",
        "./mon_202011/26/-9lddQ5-3evwK0Sz-z.png",
        "./mon_202011/26/-9lddQ5-ax7vK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-fn5jK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-kxdxK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-7ovsK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-f4usK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-hsmdK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-318aK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-6u4sK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-ey5qK1S18-18.png",
        "./mon_202011/26/-9lddQ5-isebK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-4tm0K1Sw-w.png",
        "./mon_202011/26/-9lddQ5-d42oK0Sw-z.png",
        "./mon_202011/26/-9lddQ5-j0cyK0Sz-w.png",
        "./mon_202011/26/-9lddQ5-7nuyK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-dfnkK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-e0rK1S12-11.png",
        "./mon_202011/26/-9lddQ5-5aejK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-e0maK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-j7isK1S18-18.png",
        "./mon_202011/26/-9lddQ5-2zkoK0S10-x.png",
        "./mon_202011/26/-9lddQ5-aem3K0Sy-18.png",
        "./mon_202011/26/-9lddQ5-iptfK0Sy-10.png",
      ],
      ["./mon_202011/26/-9lddQ5-g7bsK0Sz-11.png"],
    ],
    [
      "高达",
      [
        "./mon_202011/26/-9lddQ5-cuvK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-626bK0S11-y.png",
        "./mon_202011/26/-9lddQ5-c7leK1Sw-10.png",
        "./mon_202011/26/-9lddQ5-gy97K0Sw-13.png",
        "./mon_202011/26/-9lddQ5-46uuK0Sw-13.png",
        "./mon_202011/26/-9lddQ5-cgrlK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-l2wcK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-5l6fK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-b967K0Sw-11.png",
        "./mon_202011/26/-9lddQ5-jj5aK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-4pbeK0Sw-12.png",
        "./mon_202011/26/-9lddQ5-apdqK0Sw-12.png",
        "./mon_202011/26/-9lddQ5-hzlgK0Sw-12.png",
        "./mon_202011/26/-9lddQ5-4s8nK0Sw-z.png",
        "./mon_202011/26/-9lddQ5-cw5hK0Sw-z.png",
        "./mon_202011/26/-9lddQ5-ldplK0Sw-z.png",
        "./mon_202011/26/-9lddQ5-7mh6K0Sw-z.png",
        "./mon_202011/26/-9lddQ5-dwvkK0Sw-z.png",
        "./mon_202011/26/-9lddQ5-8j7yK0Sw-12.png",
        "./mon_202011/26/-9lddQ5-h9yxK0Sw-11.png",
        "./mon_202011/26/-9lddQ5-3obmK0Sw-10.png",
        "./mon_202011/26/-9lddQ5-8vknK1Sw-11.png",
        "./mon_202011/26/-9lddQ5-flfjK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-10oK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-55b4K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-cl30K0Sw-w.png",
        "./mon_202011/26/-9lddQ5-huzmK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-2qxnK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-ah2hK1Sw-w.png",
      ],
      [
        "./mon_202011/26/-9lddQ5-311qK0Sw-10.png",
        "./mon_202011/26/-9lddQ5-8e4iK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-dv7kK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-l6qbK1Sw-w.png",
        "./mon_202011/26/-9lddQ5-8q3rK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-fybzK0Sw-w.png",
        "./mon_202011/26/-9lddQ5-fippK0Sw-w.png",
      ],
    ],
  ];

  const loadSmiles = (loaded) => {
    if (loaded) return;
    
    const { correctAttachUrl } = ui;

    const tabs = poster.selectSmilesw._.__c.firstElementChild;
    const contents = poster.selectSmilesw._.__c.lastElementChild;

    smiles.forEach((item) => {
      const name = item[0];
      const list = item.flatMap((i) => (typeof i === "object" ? [...i] : []));

      const pageSize = 60;
      const pageCount = Math.ceil(list.length / pageSize);

      for (let i = 0; i < pageCount; i++) {
        const tab = document.createElement("BUTTON");
        const content = document.createElement("DIV");

        tab.className = "block_txt_big";
        tab.innerText = `${name}${
          pageCount > 1 ? `(${i + 1}/${pageCount})` : ""
        }`;
        tab.onclick = () => {
          tabs.firstChild.innerHTML = `<a href="https://bbs.saraba1st.com/2b/" target="_blank" style="color: inherit;">《粪海狂蛆》</a>`;

          contents.childNodes.forEach((c) => {
            if (c !== content) {
              c.style.display = "none";
            } else {
              c.style.display = "";
            }
          });

          if (content.childNodes.length === 0) {
            list.slice(pageSize * i, pageSize * (i + 1)).forEach((s) => {
              const smile = document.createElement("IMG");
              smile.src = correctAttachUrl(s);
              smile.style = "max-width: 60px";
              smile.onclick = () => {
                poster.selectSmilesw._.hide();
                poster.addText(`[img]${s}[/img]`);
              };

              content.appendChild(smile);
            });
          }
        };

        tabs.appendChild(tab);
        contents.appendChild(content);
      }
    });
  };

  hookFunction(poster, "selectSmiles", (returnValue) =>
    loadSmiles(returnValue)
  );

  if (location.pathname === "/post.php") {
    const corsServices = [
      "https://cors.bridged.cc/",
    ];

    const { attach_url, fid, auth } = poster.currentPostStat;

    const upload = async (url, corsIndex = 0) => {
      const corsService = corsServices[corsIndex];

      const fetch_retry = async (url, options, n) => {
        let error;
        for (let i = 0; i < n; i++) {
          try {
            return await fetch(url, options).then((res) => {
              if (!res.ok) {
                throw Error(res.statusText);
              }
              return res;
            });
          } catch (err) {
            error = err;
          }
        }
        throw error;
      };

      return fetch_retry(corsService + url, { 
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }}, 3)
        .then((res) => res.blob())
        .then((blob) => {
          const filename = url.replace(/^.*[\\\/]/, "");

          const file = new File([blob], filename, {
            type: blob.type,
            lastModified: Date.now(),
          });

          const formData = new FormData();

          formData.append("v2", "1");
          formData.append("func", "upload");
          formData.append("attachment_file1", file);
          formData.append(
            "attachment_file1_url_utf8_name",
            poster.rawUrlEncode(filename)
          );
          formData.append("attachment_file1_img", "1");
          formData.append("attachment_file1_dscp", "");
          formData.append("attachment_file1_auto_size", "0");
          formData.append("fid", fid);
          formData.append("auth", auth);
          formData.append("__output", "11");

          return fetch(attach_url, { method: "POST", body: formData });
        })
        .then((res) => res.json())
        .then((res) => {
          poster.add1Attach(
            res.attachments,
            res.attachments_check,
            res.url,
            res.isImg,
            res.thumb
          );

          return res.url;
        })
        .catch(() => "");
    };

    const migration = (task, limit = 0, length = 60) => {
      const SOURCEURL =
        "https://bbs.saraba1st.com/2b/data/cache/common_smilies_var.js";
      const STATICURL = "https://static.saraba1st.com/";

      const interval = 100;

      fetch(corsServices[0] + SOURCEURL)
        .then((res) => res.text())
        .then(async (res) => {
          eval(res);

          const pair = Object.entries(smilies_type).find(
            ([key, value]) => value[0] === task
          );

          if (pair) {
            const typeid = pair[0].substr(1);
            const typename = pair[1][0];
            const typepath = pair[1][1];

            poster.addText(
              `正在搬运[${typename}]：${limit + 1} - ${limit + length}\n`
            );

            const array = smilies_array[typeid]
              .flatMap((item) => [...item])
              .slice(limit, limit + length);

            const result = [];

            for (let item in array) {
              const filename = array[item][2];

              const smilieimg =
                STATICURL + "image/smiley/" + typepath + "/" + filename;

              const url = await upload(smilieimg);

              if (url) {
                result.push(`./${url}`);
              } else {
                poster.addText(`搬运失败：${smilieimg}\n`);
              }

              await new Promise((resolve) => setTimeout(resolve, interval));
            }

            if (result.length) {
              poster.addText(
                `[collapse=${typename}][code]${JSON.stringify(
                  result
                )}[/code]${result
                  .map((item) => `[img]${item}[/img]`)
                  .join("")}[/collapse]\n`
              );
            }
          }
        });
    };

    poster.migration = migration;
  }
})(commonui, postfunc);
