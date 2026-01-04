// ==UserScript==
// @name         AtCoderTags_Helper
// @version      2.7
// @author       Null_Null
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://*/tasks/*
// @grant        none
// @namespace    https://github.com/null-null-programming/AtCoderTags-Helper
// @description  AtCoderTagsへのTag投票を、AtCoder問題ページからTagを選ぶだけで投票できるようにします。
// @downloadURL https://update.greasyfork.org/scripts/393121/AtCoderTags_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/393121/AtCoderTags_Helper.meta.js
// ==/UserScript==

$('#copyright').append(`
<style>
    #atcoder-tags-helper > select {
        display: inline-block;
        vertical-align: top;
        width: 230px;
        margin: 0px 5px;
    }
</style>

<div id="atcoder-tags-helper" class="form-inline" style="padding-top: 5rem">
    <select id="tag_parent" class="form-control" name="tag" size="18">
        <option data-subgroup="Easy" value="Easy">Easy</option>
        <option data-subgroup="Ad-Hoc" value="Ad-Hoc">Ad-Hoc</option>
        <option data-subgroup="Searching" value="Searching">Searching</option>
        <option data-subgroup="Greedy-Methods" value="Greedy-Methods">Greedy-Methods</option>
        <option data-subgroup="String" value="String">String</option>
        <option data-subgroup="Mathematics" value="Mathematics">Mathematics</option>
        <option data-subgroup="Technique" value="Technique">Technique</option>
        <option data-subgroup="Construct" value="Construct">Construct</option>
        <option data-subgroup="Graph" value="Graph">Graph</option>
        <option data-subgroup="Dynamic-Programming" value="Dynamic-Programming">Dynamic-Programming</option>
        <option data-subgroup="Data-Structure" value="Data-Structure">Data-Structure</option>
        <option data-subgroup="Game" value="Game">Game</option>
        <option data-subgroup="Flow-Algorithms" value="Flow-Algorithms">Flow-Algorithms</option>
        <option data-subgroup="Geometry" value="Geometry">Geometry</option>
        <option data-subgroup="Interactive" value="Interactive">Interactive</option>
        <option data-subgroup="April-Fool" value="April-Fool">April-Fool</option>
        <option data-subgroup="Marathon" value="Marathon">Marathon</option>
        <option data-subgroup="Other" value="Other">Other</option>
    </select>

    <select id="tag_child" class="form-control" name="tag2" size="18">
        <option data-group="Searching" value="Brute-Force">全探索</option>
        <option data-group="Searching" value="Binary-Search">二分探索</option>
        <option data-group="Searching" value="Ternary-Search">三分探索</option>
        <option data-group="Searching" value="DFS">深さ優先探索</option>
        <option data-group="Searching" value="BFS">幅優先探索</option>
        <option data-group="Searching" value="Bit-Brute-Force">bit全探索</option>
        <option data-group="Searching" value="Heuristic">ヒューリスティック</option>
        <option data-group="Searching" value="Other">その他</option>

        <option data-group="String" value="String-Operation">文字列処理</option>
        <option data-group="String" value="Rolling-Hash">ローリングハッシュ</option>
        <option data-group="String" value="Manacher">Manacher</option>
        <option data-group="String" value="Suffix-Array">Suffix-Array</option>
        <option data-group="String" value="Z-Algorithm">Z-Algorithm</option>
        <option data-group="String" value="Trie">Trie</option>
        <option data-group="String" value="Parsing">構文解析</option>
        <option data-group="String" value="Other">その他</option>

        <option data-group="Mathematics" value="Number">整数</option>
        <option data-group="Mathematics" value="Combinatorics">組み合わせ</option>
        <option data-group="Mathematics" value="Enumerate">数え上げ</option>
        <option data-group="Mathematics" value="Probability">確率</option>
        <option data-group="Mathematics" value="Expected-Value">期待値</option>
        <option data-group="Mathematics" value="Matrix">行列</option>
        <option data-group="Mathematics" value="XOR">XOR</option>
        <option data-group="Mathematics" value="Other">その他</option>

        <option data-group="Technique" value="Sort">ソート</option>
        <option data-group="Technique" value="Simulation">シミュレーション</option>
        <option data-group="Technique" value="Cumulative-Sum">累積和</option>
        <option data-group="Technique" value="imos">imos法</option>
        <option data-group="Technique" value="Two-Pointers">尺取り法</option>
        <option data-group="Technique" value="Recursion">再帰関数</option>
        <option data-group="Technique" value="Compress">座標圧縮</option>
        <option data-group="Technique" value="Split-And-List">半分全列挙</option>
        <option data-group="Technique" value="Square-Division">平方分割</option>
        <option data-group="Technique" value="Divide-And-Conquer">分割統治法</option>
        <option data-group="Technique" value="Doubling">ダブリング</option>
        <option data-group="Technique" value="Randomized-Algorithm">乱択アルゴリズム</option>
        <option data-group="Technique" value="Other">その他</option>

        <option data-group="Graph" value="Shortest-Path">最短経路</option>
        <option data-group="Graph" value="Minimum-Spanning-Tree">最小全域木</option>
        <option data-group="Graph" value="LCA">最小共通祖先</option>
        <option data-group="Graph" value="Strongly-Connected-Components">強連結成分分解</option>
        <option data-group="Graph" value="Topological-Sort">トポロジカルソート</option>
        <option data-group="Graph" value="Euler-Tour">オイラーツアー</option>
        <option data-group="Graph" value="Euler-Path-and-Hamilton-Path">オイラーパス・ハミルトンパス</option>
        <option data-group="Graph" value="HL-Decomposition">HL分解</option>
        <option data-group="Graph" value="Centroid-Decomposition">重心分解</option>
        <option data-group="Graph" value="Check-Tree">木の同型判定</option>
        <option data-group="Graph" value="Kirchhoff">行列木定理</option>
        <option data-group="Graph" value="Two-Edge-Connected-Components">二重辺連結成分分解</option>
        <option data-group="Graph" value="Bi-Connected-Components">二重頂点連結成分分解</option>
        <option data-group="Graph" value="Cycle-Basis">サイクル基底</option>
        <option data-group="Graph" value="dfs-tree">dfs木</option>
        <option data-group="Graph" value="Erdesh">エルデシュガライの定理</option>
        <option data-group="Graph" value="Other">その他</option>

        <option data-group="Dynamic-Programming" value="Simple-DP">基礎DP</option>
        <option data-group="Dynamic-Programming" value="Restore-DP">戻すDP</option>
        <option data-group="Dynamic-Programming" value="String-DP">文字列DP</option>
        <option data-group="Dynamic-Programming" value="Section-DP">区間DP</option>
        <option data-group="Dynamic-Programming" value="Digit-DP">桁DP</option>
        <option data-group="Dynamic-Programming" value="Tree-DP">木DP</option>
        <option data-group="Dynamic-Programming" value="Every-Direction-DP">全方位木DP</option>
        <option data-group="Dynamic-Programming" value="Bit-DP">bitDP</option>
        <option data-group="Dynamic-Programming" value="Probability-DP">確率DP</option>
        <option data-group="Dynamic-Programming" value="Expected-Value-DP">期待値DP</option>
        <option data-group="Dynamic-Programming" value="Insert-DP">挿入DP</option>
        <option data-group="Dynamic-Programming" value="Link-DP">連結DP</option>
        <option data-group="Dynamic-Programming" value="Inline-DP">インラインDP</option>
        <option data-group="Dynamic-Programming" value="Matrix-Power">行列累乗</option>
        <option data-group="Dynamic-Programming" value="CHT">Convex-Hull-Trick</option>
        <option data-group="Dynamic-Programming" value="Monge-DP">Monge-DP</option>
        <option data-group="Dynamic-Programming" value="Alien-DP">Alien-DP</option>
        <option data-group="Dynamic-Programming" value="Kitamasa">きたまさ法</option>
        <option data-group="Dynamic-Programming" value="Other">その他</option>

        <option data-group="Data-Structure" value="stack">stack</option>
        <option data-group="Data-Structure" value="queue">queue</option>
        <option data-group="Data-Structure" value="set">set</option>
        <option data-group="Data-Structure" value="map">map</option>
        <option data-group="Data-Structure" value="deque">deque</option>
        <option data-group="Data-Structure" value="multiset">multiset</option>
        <option data-group="Data-Structure" value="priority_queue">priority_queue</option>
        <option data-group="Data-Structure" value="Union-Find-Tree">Union-Find-Tree</option>
        <option data-group="Data-Structure" value="BIT">Binary-Indexed-Tree</option>
        <option data-group="Data-Structure" value="Segment-Tree">Segment-Tree</option>
        <option data-group="Data-Structure" value="Lazy-Segment-Tree">Lazy-Segment-Tree</option>
        <option data-group="Data-Structure" value="Sparse-Table">Sparse-Table</option>
        <option data-group="Data-Structure" value="WaveletMatrix">WaveletMatrix</option>
        <option data-group="Data-Structure" value="Persistent-Data-Structures">永続データ構造</option>
        <option data-group="Data-Structure" value="Balanced-Tree">平衡二分探索木</option>
        <option data-group="Data-Structure" value="Other">その他</option>

        <option data-group="Game" value="Nim">Nim</option>
        <option data-group="Game" value="Grundy">Grundy数</option>
        <option data-group="Game" value="Backtrack">後退解析</option>
        <option data-group="Game" value="Mini-Max">ミニマックス法</option>
        <option data-group="Game" value="unique">特殊な性質</option>
        <option data-group="Game" value="Other">その他</option>

        <option data-group="Flow-Algorithms" value="Max-Flow">最大流問題</option>
        <option data-group="Flow-Algorithms" value="Min-Cost-Flow">最小費用流問題</option>
        <option data-group="Flow-Algorithms" value="Bipartite-Matching">二部マッチング</option>
        <option data-group="Flow-Algorithms" value="Min-Cut">最小カット</option>
        <option data-group="Flow-Algorithms" value="Burn">燃やす埋める</option>
        <option data-group="Flow-Algorithms" value="Other">その他</option>

        <option data-group="Geometry" value="Convex-Hull">凸包</option>
        <option data-group="Geometry" value="Declination-Sorting">偏角ソート</option>
        <option data-group="Geometry" value="Voronoi-Diagram">ボロノイ図</option>
        <option data-group="Geometry" value="Three-D">三次元</option>
        <option data-group="Geometry" value="Other">その他</option>
    </select>
    <br>
    <br>

    <input id="atcoder_tag_vote" type="submit" value="Submit" class="btn btn-primary">
</div>
`);

function getContestName() {
  const contestURL = location.href;
  const contestArray = contestURL.split('/');
  return contestArray[contestArray.length - 1];
}

function enableNestedChoice(parentSelect, childSelect) {
  $(parentSelect).change(function () {
    var subgroup = $(this).find('option:selected').attr('data-subgroup');

    $(childSelect).find("option").each(function (index, element) {
      var group = $(element).attr('data-group');

      if (subgroup === group) {
        $(element).show();
      } else {
        $(element).hide();
      }
    });

    $(childSelect).val('').change();
  });
}

$('#atcoder_tag_vote').click(function () {
  const parent_tag = $('#tag_parent').val();
  const child_tag = $('#tag_child').val();
  const problem_id = getContestName();

  const url = `https://atcoder-tags.herokuapp.com/vote_result?problem_id=${problem_id}&tag=${parent_tag}&tag2=${child_tag}`;
  window.open(url);
});

enableNestedChoice('#tag_parent', '#tag_child');

$('#tag_parent').val('').change();
$('#tag_child').val('').change();