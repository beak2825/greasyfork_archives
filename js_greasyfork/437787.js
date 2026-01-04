// ==UserScript==
// @name        NBA楽天 特定のアイコンのコメント削除
// @namespace   nn-nito
// @description NBA楽天のライブ配信時特定のアイコンのコメントを削除する
// @include     https://nba.rakuten.co.jp/games/*
// @version     1.0.1
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/437787/NBA%E6%A5%BD%E5%A4%A9%20%E7%89%B9%E5%AE%9A%E3%81%AE%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/437787/NBA%E6%A5%BD%E5%A4%A9%20%E7%89%B9%E5%AE%9A%E3%81%AE%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

(() => {
    //===========================================================================
    /** ユーザーカスタム */
    const TEAMTARGETREMOVALLIST = {
        /**
         * コメント欄から削除したいチーム名or顔アイコンの左隣りにある二本のスラッシュ(/)を取ってください
         * 例）レイカーズアイコンのコメントを表示したくない場合
         * [before] //'024': 'レイカーズ', [after] '024': 'レイカーズ',
         */

        // '001': 'ホークス',
        // '002': 'ネッツ',
        // '003': 'セルティックス',
        // '004': 'ホーネッツ',
        // '005': 'ブルズ',
        // '006': 'キャバリアーズ',
        // '007': 'マーベリックス',
        // '008': 'ナゲッツ',
        // '009': 'ピストンズ',
        // '010': 'ウォリアーズ',
        // '011': 'ロケッツ',
        // '012': 'ペイサーズ',
        // '013': 'クリッパーズ',
        // '014': 'レイカーズ',
        // '015': 'グリズリーズ',
        // '016': 'ヒート',
        // '017': 'バックス',
        // '018': 'ウルブズ',
        // '019': 'ペリカンズ',
        // '020': 'ニックス',
        // '021': 'サンダー',
        // '022': 'マジック',
        // '023': 'シクサーズ',
        // '024': 'サンズ',
        // '025': 'ブレイザーズ',
        // '026': 'キングス',
        // '027': 'スパーズ',
        // '028': 'ラプターズ',
        // '029': 'ジャズ',
        // '030': 'ウィザーズ',
        // '031': 'イヤリング付けた色黒な美女',
        // '032': 'ドレッドヘアでディアンジェロラッセルぽい',
        // '033': '変なサングラスつけた金髪の女性',
        // '034': 'ベンチャー企業の社長ぽい',
        // '035': 'イヤリング付けた銀髪の美女',
        // '036': 'モヒカン',
        // '037': '青髪のOLっぽい女性',
        // '038': '陰キャぽい赤髪男性',
        // '039': 'アメリカの歌手っぽい赤髪ロングで色黒の女性',
        // '040': 'スキンヘッド',
        // '041': 'メンヘラぽい',
        // '042': '七三分け金髪メガネ',
        // '043': 'ツインテール青髪',
        // '044': '黒ニット帽',
        // '045': 'ダンスやってそうな赤髪眼鏡女性',
        // '046': 'さとし',
        // '047': 'ルーズな服を着るイケてる女子ぽい',
        // '048': 'ドレッドヘアでヘッドバンドつけてる色黒男性',
        // '049': '黒髪ロング',
        // '050': '色白で背が高そう',
        // '051': '真ん中に24',
        // '052': '真ん中に8',
    };
    const NGCOMMENTLIST = [
        /**
         * NGにしたい文字列を追加してください
         * 例）ラスという文字列を含むコメントを表示したくない場合
         * 'ラス',
         */
    ];
    //===========================================================================

    /** 定数 */
    const DISPLAYCOMMENT = '#このコメントは削除されました';
    const DISPLAYNG = '#NGコメント';

    /** メンバ */
    var commentSection;

    /** 処理 */
    function main() {
        document.body.addEventListener('DOMNodeInserted', function (element) {
            if (element.target.className === 'pGamesDetail-video-chat slide-enter slide-enter-active') {
                commentSection = getCommentSection();
                monitorCommnetInsertion();
            }
        });
    }

    /** コメント欄取得 */
    function getCommentSection() {
        return document.querySelector('.ChatList-container');
    }

    /** コメント取得 */
    function getComment(node) {
        return node.querySelector('.bTypography__variant_body2');
    }

    /** コメントのソース取得 */
    function getCommentSrc(node) {
        return node.querySelector('img[src]');
    }

    /* コメントの追加を監視 */
    function monitorCommnetInsertion() {
        commentSection.addEventListener('DOMNodeInserted', function (element) {
            if (TEAMTARGETREMOVALLIST.length !== 0) {
                // アイコン コメント削除
                removeCommentByIcon(element);
            }
            if (NGCOMMENTLIST.length !== 0) {
                // NGコメント コメント削除
                removeCommentByNG(element);
            }
        });
    }

    /** 特定アイコンのコメント削除 */
    function removeCommentByIcon(element) {
        let target = element.target;
        if (target.className !== 'ChatCard') return;

        const img = getCommentSrc(target);
        let teamId = img.src.match(/icon\/(\d+)\.png/);
        teamId = teamId[1]
        if (teamId in TEAMTARGETREMOVALLIST === false) return;

        if (img.src === `https://image.nba.rakuten.co.jp/media/user/profile/icon/${teamId}.png?imwidth=64`) {
            // 削除 実際には削除せずテキストを置き換え
            let comment = getComment(target);
            comment.textContent = DISPLAYCOMMENT;
        }
    }

    /** NGコメント削除 */
    function removeCommentByNG(element) {
        let target = element.target;
        if (target.className !== 'ChatCard') return;

        let comment = getComment(target);
        const content = comment.textContent;
        let isRemoval = false;

        NGCOMMENTLIST.forEach((ng) => {
            const pattern = new RegExp('.*' + ng + '.*');
            const match = content.match(pattern);
            if (match === null) return; // 不一致

            isRemoval = true;
        });
        if (isRemoval) {
            // 削除 実際には削除せずテキストを置き換え
            comment.textContent = DISPLAYNG;
        }
    }

    // 実行
    main();
})();