// ==UserScript==
// @name         MuleSoft的Training课程外挂
// @namespace    https://greasyfork.org/zh-CN/users/41249-tantiancai
// @version      1.0.4
// @description  通过反复做题，获得正确答案。目前只对应了模拟考试部分，其他部分在陆续开发中。
// @author       tantiancai
// @original-script   https://greasyfork.org/zh-CN/scripts/452008
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @include      https://training.mulesoft.com/site/coursePlayer.do?*
// @downloadURL https://update.greasyfork.org/scripts/452008/MuleSoft%E7%9A%84Training%E8%AF%BE%E7%A8%8B%E5%A4%96%E6%8C%82.user.js
// @updateURL https://update.greasyfork.org/scripts/452008/MuleSoft%E7%9A%84Training%E8%AF%BE%E7%A8%8B%E5%A4%96%E6%8C%82.meta.js
// ==/UserScript==

// Sample如下：
// var arrList = [
//     {
//         Q: 'Center for Enablement (C4E) は、CloudHub のデプロイメントモデルにおいて、API 呼び出しに対する非機能的なセキュリティポリシーを定義するようチームに依頼しました。\n\n\n\nセキュリティ関連の要件をサポートする、Anypoint Platform ですぐに利用可能なポリシーは次のうちどれですか? (3つ選んでください)',
//         A: [
//             'JWT Validation (JWTバリデーション)',
//             'JSON Threat Protection (JSON 脅威保護)',
//             'Basic Authentication (ベーシック認証) - LDAP'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'CloudHub にデプロイされた Mule アプリケーションのカスタムアラートを作成するために必要なアクションは次のうちどれですか? (2つ選んでください)',
//         A: [
//             'Mule アプリケーションに CloudHub  用の Anypoint コネクタを追加する。',
//             'Runtime Manager でカスタムアプリケーションのアラートを設定する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Cache スコープが適しているシナリオは次のうちどれですか？(2 つ選んでください)',
//         A: [
//             'API インスタンスの処理負荷を軽減する。',
//             '外部への呼び出しを行うコネクタから返される、頻繁に変更されないデータを保存する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある MuleSoft アーキテクトがプロジェクトの要件定義をしました。\n\n\n\nプロジェクトの要件を機能に変換し、API として設計、検証、公開するためのツールはどれですか? (3 つ選んでください)',
//         A: [
//             'Exchange',
//             'Mocking service (モッキングサービス)',
//             'Design Center'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある多国籍銀行のチームは、新しいシステム API (System API) を導入しました。\n\n\n\nこのチームがこの決定を下した理由として推測されるものは次のうちどれですか? (2つ選んでください)',
//         A: [
//             '管理システムのインターフェースが過度に複雑なデータモデルを使用しており、その大部分は銀行の業務に適用できないものであった。',
//             '不正なリクエストにより、管理システムのデータが誤って変更されていた。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Anypoint Platform の API ポリシーを使用して、効果的に適用できるイベントは次のどれですか? ( 3 つ選んでください)\n',
//         A: [
//             'API 間のクレデンシャル認証',
//             'バックエンドシステムへの過負荷の防止',
//             'HTTP リクエストとレスポンスのログ出力'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\nある組織が、API Manager でプロキシエンドポイント (endpoint with proxy) を使用して、非 Mule API 実装を管理しています。API インスタンスには、Client ID Enforcement (クライアント ID 適用) ポリシーが適用されています。現在、顧客がホストするデータベース内の既存の顧客パスワードテーブルを使用して、HTTP Basic Authentication (ベーシック認証) で API を保護する新しい要件があります。\n\n\n要件を満たすために、最も効率的で再利用がしやすい方法は次のうちどれですか?\n\n\n※ Client: クライアント\n※ HTTP Basic Auth: HTTP ベーシック認証\n※ JDBC: Java Database Connectivity\n\n※ Non-Mule App: 非 Mule アプリケーション\n※ Customer Password Table: 顧客のパスワードテーブル\n※ Customer Network: 顧客ネットワーク\n\n\n\n',
//         A: [
//             'ユーザー名とパスワードをデータベーステーブルから取得し、検証するカスタムポリシーを作成する。\n\nこのカスタムポリシーを Anypoint Exchange にデプロイする。\nカスタムポリシーを API インスタンスに割り当てる。\n接続文字列 (connection string) を使用してポリシー定義を構成する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある企業は、MuleSoft の API 主導の接続性 (API-led Connectivity) アプローチの採用に着手しました。接続性の課題を解決し、基幹システムからデータを解放するための API を構築することを計画しています。\n\n\n\nこれらを達成するために、どの層の API を作成する必要がありますか? また、それらの API に責任を持つのはどのチームですか?',
//         A: [
//             '中央 IT 部門が、ビジネスプロセスを加速させるために、データをアンロック (解放する) システム API (System API) を作成する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Anypoint Platform のクライアント管理 (client management) を構成するために、外部 ID プロバイダ (external Identity Provider, IdP) を使用する場合の主な要件は次のうちどれですか?',
//         A: [
//             'API クライアントは、Anypoint Platform が管理する OAuth 2.0 で保護された API を呼び出すために、同一 ID プロバイダ (IdP) が発行したアクセストークンを送信する。 \n'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Anypoint Platform から利用できる API 呼び出しメトリクス (指標) の副産物 (byproduct) は何ですか? またその副産物はどのように活用できますか? ',
//         A: [
//             'API の過去の呼び出しのデータ。\nこのデータは、様々な API における異常や使用パターンを特定するために使用される。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'MuleSoft が推奨する API 主導の接続性 (API-led Connectivity) アプローチにおいて、システム API (System APi) を構築する際のベストプラクティスは次のうちどれですか?',
//         A: [
//             'RAML 定義のように簡単に消費できるアセット (資産) を使用して、システム API (System API)をドキュメント化する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\n3 つのビジネスプロセスを実装する必要があり、その実装は複数の異なる SaaS アプリケーションと通信する必要があります。\n\n\nこれらのプロセスは、個別にサイロ化された事業部門 (LoB, Line of Business) が所有し互いに独立していますが、いくつかのビジネスエンティティは事業部門間で共有されています。また、各事業部門はそれぞれの開発チームと独自の予算を持っています。\n\n\nこのような組織の状況において、これらのビジネスプロセスを実装するAPIのデータモデルを、冗長性を最小限に抑えつつ選択するための最も効果的なアプローチは次のうちどれですか?\n\n\n※ LoB: Line of Business (業務部門)\n※ EAPIs: エクスペリエンス API\n\n※ PAPIs: プロセス API\n\n※ SAPIs: システム API\n\n※ Entity: エンティティ \n\n\n\n',
//         A: [
//             '関連するビジネスプロセスとビジネスエンティティの定義に沿った、複数の Bounded Context Data Model (境界コンテクストデータモデル) を構築する。\n\n'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\nAPI主導の接続性 (API-led Connectivity) とアプリケーションネットワークの文脈において、API が通常使用するデータ形式 (フォーマット) とトランスポートプロトコルの組み合わせは次のうちどれですか?\n\n\n※ operation (): オペレーション/操作\n※ reply: 返信/応答\n\n※ Top Layer: トップレイヤー\n※ Middle Layer: ミドルレイヤー\n※ Bottom Layer: ボトムレイヤー\n※ Network: ネットワーク\n\n\n※ Client: クライント\n※ Server: サーバー\n※ Data format: データ形式\n※ Transport protocol:トランスポートプロトコル\n\n\n\n\n\n',
//         A: [
//             '形式 (フォーマット) : JSON \nプロトコル: HTTP'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある顧客が MuleSoft を使い始め、本番環境で CloudHub 1.0 の Virtual Private Cloud (VPC) を稼働させたいと考えています。この顧客は 2 台の DLB (Dedicated Load Balancer, 専用ロードバランサー) を契約しています。\n\n\n\n2 台のCloudHub 1.0 DLB はどのように構成されるべきですか?',
//         A: [
//             '1つの DLB を公開アプリケーション用に、もう 1 つを非公開アプリケーション用に構成する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '水平方向 (horizontal scaling) のスケーリングが有効なシナリオは次のうちどれですか/?',
//         A: [
//             '頻繁に小さな payload を受け取る API プロキシ'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある顧客は、API Manager で定義された API ポリシーが適切に適用されるように、API クライアントのリクエストを受け取る Mule アプリケーションの API エンドポイントを実装したいと考えています。また、API エンドポイントは API クライアントにレスポンスを返す必要があります。\n\n\n\n使用する必要があるデータ形式 (フォーマット)、およびトランスポートプロトコルは次のうちどれですか?',
//         A: [
//             'データ形式 (フォーマット) : HTTP/ 1.x で受信するあらゆる形式のデータ\n各 API クライアントのリクエストに対するレスポンスが必要である。 '
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'あるお客様が CloudHub 1.0 の U.S. East (アメリカ東部) リージョンを使用しており、U.S. West (アメリカ西部) リージョンでバックアップとリストアのオプション (RPO, 目標復旧時点: 数時間, RTO 目標復旧時間: 24 時間以内) を使用した DR (Disaster Recovery, 災害復旧) を希望しています。本番環境には、複数のアプリケーション (API) が導入されており、Transit Gateway を介してお客様のプライベートクラウドに接続し、同様に VPN を介してオンプレミスにも接続しています。お客様のプライベートクラウドでは、AWSの弾力性 (resiliency) の推奨に従って Direct Connect を使用し、米国東西のオンプレミスと通信しています。お客様の AWS プライベートクラウドチームは、すでに DR (災害復旧) スクリプトとスタンドアロンのテストを完了させています。\n\n\n\nこの顧客のために、どのように災害復旧に対処しますか?',
//         A: [
//             'CloudHub 1.0 からお客様のプライベートクラウドを経由するオンプレミスのトラフィックルーティングを、U.S. East の Direct Connect に変更する。\n災害復旧のため、CloudHub 1.0 とお客様のプライベートクラウドの間に U.S. West の Transit Gateway トランジットゲートウェイ接続を確立する。\nU.S.West の CloudHub 1.0 に、マイナーチェンジを含めた全てのアプリケーションをデプロイする。\nテスト終了後、U.S. West の CloudHub 1.0 インスタンスのセットアップを削除する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '複数の API 実装 (Muleアプリケーション) を持つ API は、CloudHub と Customer-hosted (顧客がホストする) Mule ランタイムの両方にデプロイされます。すべてのデプロイメントは、MuleSoft-hosted (MuleSoft がホストする) コントロールプレーンで管理されています。API 実装が API リクエストへの応答を停止するたびに、たとえ API クライアントがしばらくの間その API 実装を呼び出していなくても、アラートをトリガーする必要があります。\n\n\n\nAPI 実装を監視するために、どのようにこれらのアラートを作成することができますか?',
//         A: [
//             'API Functional Monitoring で、API 実装のモニターを作成し、各モニターが API 実装のエンドポイントを繰り返し呼び出す。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある組織では、顧客の住所情報を取得するための 「Customer Address API (顧客住所 API)」を導入しています。この API は複数の環境に展開され、呼び出しにはクライアント ID (client ID)が必須になるようにに設定されています。\n\n\n\nある開発者は、ユーザーが自分の住所を更新できるようにするためのクライアントアプリケーションを作成しています。この開発者は、Anypoint Exchange で Customer Address API を発見し、クライアントアプリケーションで使用したいと考えています。\n\n\nAPI へのアクセス権限を得るための手順のうち、Anypoint Platform が自動的に実行するように設定可能な手順は次のうちどれですか? ',
//         A: [
//             'クライアントアプリケーションから、選択された SLA (Service Level Agreement, サービス品質保証) 階層へのリクエストを承認する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある保険会社が多くの顧客によって使用される見積もりエンジンのためのエクスペリエンス API (Experience API) を構築しました。IT チームは、API に Client ID Enforcement (クライアント ID 適用) ポリシーを適用しています。\n\n\n\nIT チームがこのポリシーを選択した理由として、最も適切なものは次のうちどれですか?？',
//         A: [
//             'サービスを利用するクライアントアプリケーションを識別するため。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'API インスタンスが API Manager で管理されています。対応する Mule アプリケーションは、API インスタンスを実装するために Mule ランタイムにデプロイされます。API Manager で API インスタンスに対して定義または変更された API ポリシーは、Mule アプリケーションの API エンドポイントに対して適用される必要があります。\n\n\n\nこの API インスタンスに対して API Manager で定義されたポリシーをこの Mule アプリケーションに適用するために、Mule アプリケーションが API インスタンスと接続する方法は次のうちどれですか?',
//         A: [
//             'API Manager の API インスタンス設定から取得した API ID を使用し、Mule アプリケーションで API autodiscovery (API オートディスカバリー) を構成する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある小売企業が、自社の API を外部の顧客に公開したいと考えています。顧客は、モバイルデバイスやデスクトップ/ノートブックなどのデバイスから API データを利用します。異なるデバイスを使用するユーザーに対応するために、データをカスタマイズする必要があります。\n\n\nこれらの API は API主導の接続性 (API-led Connectivity) レイヤーのうち、どこに配置されるべきですか？',
//         A: [
//             'Experience (エクスペリエンス層)'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Mule アプリケーションが CloudHub 1.0 Shared Worker クラウドにデプロイされたときに作成される完全修飾ドメイン名 (FQDN) 、いわゆる DNS エントリの一意性を決定する要素は次のうちどれですか?',
//         A: [
//             'アプリケーション名とアプリケーションを配置したリージョン'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'あるアプリケーションが 2 つの 0.1vCore CloudHub ワーカーで実行されています。時々アプリケーションがクラッシュし、その原因が "out of disk space" (ディスクスペースの不足) エラーであることが判明しました。アプリケーションに必要なディスク容量は、正当な理由により一時的に 10 GB を超えます。\n\n\n\n問題を解決するために、チームが取るべきアクションは次のうちどれですか?',
//         A: [
//             'ワーカーサイズを 1.0 vCores に増やす。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\nCustomer-hosted (顧客がホストする) Mule ランタイムを、MuleSoft-hosted (MuleSoft がホストする ) Anypoint Platform コントロールプレーンで使用する場合の適切な説明は次のうちどれですか?\n\n\n※ CloudHub US East1: CloudHub 米国東部1 リージョン\n\n※ EAPIs: エクスペリエンス API\n※ PAPIs: プロセス API\n※ SAPIs: システム API\n※ Corporate Data Center: 企業のデータセンター\n\n\n\n\n\n',
//         A: [
//             'API とコントロールプレーン間の通信ができない場合でも、Customer-hosted (顧客がホストする Mule ランタイム) で API 実装を正常に実行することができる。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\nAnypoint Platform REST API, Anypoint CLI, Mule Maven プラグイン, および API ポリシーなどのツールを使用して、 Anypoint Platform とのやりとりを自動化することについて、正しい記述は次のうちどれですか?\n\n\n※ Mule Runtime: Mule ランタイム\n※ Roles: 役割 \n\n※ Mule Maven plugin: Mule Maven プラグイン\n\n※ API Policies: API ポリシー\n\n\n\n\n',
//         A: [
//             'デフォルトでは、Anypoint CLI と Mule Maven プラグインは Mule ランタイムに含まれていないため、デプロイされた Mule アプリケーションで使用することはできない。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'EST API 実装の統合テスト (インテグレーションテスト) について、正しい記述は次のうちどれですか?',
//         A: [
//             'デプロイされた Web API 実装に対して Web API 呼び出しをトリガーし、応答をアサート (assert) するために、SoapUI または Postman を使用して実装することができる。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '自動化されていない API ポリシーを適用するための正しいプロセスと、ポリシーが適用される API インスタンスについての正しい説明は次のうちどれですか?',
//         A: [
//             '特定の API インスタンスに対して、API Managerで API ポリシーを定義する。\n\nその後、API ポリシーは指定した特定の API インスタンスにのみ適用される。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある企業は、プライマリーアカウント番号 (primary account number, PAN), 個人識別情報 (personally identifiable information, PII), 保護医療情報 (protected health information, PHI) など機密とみなされる情報を保護したいと考えています。この企業は、MuleSoft のライセンスとソフトウェアを契約する際に、Tokenization (トークナイゼーション, トークン化機能) が利用可能であることを確認しています。\n\n\n\nこれらの要件を満たす Mule コントロールプレーンとランタイムプレーンの組み合わせは次のうちどれですか?',
//         A: [
//             'コントロールプレーン: MuleSoft-hosted (MuleSoft がホスト) \nランタイムプレーン: Customer-hosted (お客様がホストする) Anypoint Runtime Fabric (RTF) '
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'APIの実装が更新されました。\n\n\n\nAPI の RAML 定義を更新するべきタイミングは次のうちどれですか?',
//         A: [
//             'API 実装がリクエストメッセージやレスポンスメッセージの構造を変更した場合'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'API Manager が管理している REST API 仕様があります。REST リクエスト呼び出しを処理する際の、API インターフェース、API 実装、API クライアント、および API ポリシーの相互作用に関する適切な説明は次のうちどれですか?',
//         A: [
//             'API クライアントが、APIインタフェースが呼び出し API ポリシーが適用され、その後 API 実装が呼び出され REST リクエストが処理される。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある小売企業がクレジットカード処理業者とやり取りするための API を設計しています。クレジットカード処理業者が提供する API を呼び出す前に、クレジットカードのデータをログに記録する必要があります。\n\n\n\n個人情報を含むデータをマスクするための Tokenization (トークナイゼーション) 機能が利用できる MuleSoft のデプロイメントモデルは次のうちどれですか?',
//         A: [
//             'Runtime Fabric (RTF)'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'あるビジネスプロセスを実装するために、粗い粒度 (coarse-grained) ではなく細かい粒度 (fine-grained) のAPI デプロイメントモデルを使用した場合の典型的な結果は次のうちどれですか?',
//         A: [
//             'アプリケーションネットワーク内の発見可能な API 関連アセット (資産) の数が多くなる。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'レート制限 (rate limiting) API ポリシーの適用を、API の RAML 定義に正確に反映させる方法は次のうちどれですか?',
//         A: [
//             '429 ステータスコード、x-ratelimit-* レスポンスヘッダー、説明 (description)、タイプ (type)、例 (example) を追加し、レスポンスを明確に定義する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある組織が MuleSoft が定義する「モダン API (modern API)」を活用し、IT アセット (資産) の再利用可能を重視する IT 運用モデルに移行する戦略的決定を行いました。\n\n\n\nこの新しい IT 運用モデルにおける「モダン API」についての適切な記述は次のうちどれですか?',
//         A: [
//             'モダン API は、各 API を製品のように扱い、再利用しやすいように設計する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Runtime Fabric on self-managed Kubernetes (自社管理の Kubernetes で実行する Runtime Fabric)  を使用しているお客様は、ワーカーノードのヘルスチェックとコアのキャパシティをどのように監視すればよいですか?\n',
//         A: [
//             'Kubernetes プロバイダーが提供するツールを使用する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Order (注文 ) Mule アプリケーションは、Virtual Private Cloud (VPC) が構成されたCloudHub 環境にデプロイされます。DLB (Dedicated Load Balancer, 専用ロードバランサー) は構成されていません。\n\n\nこの CloudHub環境への Mule アプリケーションのデプロイメントに構成できる、ネットワークの機能は次のうちどれですか?',
//         A: [
//             'Order (注文) Mule アプリケーションを実行する CloudHubワーカー／レプリカ用の静的 IP アドレス\n'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある組織は、MuleSoft-hosted (MuleSoft がホストする) ランタイムプレーンと、Customer-hoted (顧客がホストする) ランタイムプレーンの両方にアプリケーションをデプロイしています。すべてのデプロイメントは、MuleSoft がホストするコントロールプレーンで管理されています。API Manager で管理されているデプロイ済みの API 実装の呼び出しに関連するアラートが、MuleSoft がホストするコントロールプレーンに作成されました。組織の情報セキュリティチームは、これらのアラートを生成するデータまたはメタデータのソースを特定する必要があります。 \n\n\n\nこれらのアラートをトリガーするデータは、どこから生成されますか?',
//         A: [
//             'MuleSoft がホストするランタイムプレーンと、顧客がホストするランタイムプレーン'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある組織では、モバイルアプリと Web アプリの両方から顧客データにアクセスできるようにする必要があります。これらのアプリはそれぞれ「共通のフィールド」と、特定の「固有のフィールド」にアクセスする必要があります。データの一部はデータベースから、他の一部はサードパーティの CRM (顧客管理) システムから取得できます。\n\n\n\nMuleSoft が推奨する API 主導の接続性 (API-led Connectivity) アプローチにおいて、これらの設計要件に適合するように API を作成する方法は次のうちどれですか?\n\n\n※ Web App: ウェブアプリ\n※ Mobile App: モバイルアプリ\n※ DB: データベース\n※ CRM: 顧客管理システム\n\n\n\n',
//         A: [
//             'モバイルアプリと Web アプリのエクスペリエンス API (Web EAPI, Mobile EAPI) は別々で用意するが、データベースと CRM システム用に作成した個別のシステム API を呼び出すプロセス API (Common PAPI) は共通のものを使用する。\n\n\n※ Web EAPI: ウェブエクスペリエンス API\n※ Mobile EAPI: モバイルエクスペリエンス API\n※ Common PAPI: 共通プロセス API\n※ DB SAPI: データベースシステム API\n※ CRM SAPI: 顧客管理システム API\n\n'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'HTTP リクエストの中には、リクエストに使用された HTTP の動詞 (verb) によって、レスポンスをキャッシュできるものがあります。\n\n\n\nHTTP の仕様における「セーフメソッド (safe method) 」は次のうちどれですか？',
//         A: [
//             'GET, OPTIONS, HEAD'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある組織の中央 IT グループは、多くの特殊なコンポーネントを持ち、複雑なアルゴリズムでプログラムを実行するレガシーシステムのシステム API (System API, SAPI) を構築しています。\n\n\n\nシステム API を使用するビジネスプロセスが、データ分析を目的としてバックエンドシステムのデータをそのままの形で必要とするため、IT 組織はバックエンドシステムをシステム API のデータモデルに反映することを決定しました。\n\n\nこれらの要件において、ビジネスプロセスKaraバックエンドシステムに直接接続するのではなく、システム API を設計することの主な利点は次のうちどれですか?',
//         A: [
//             'バックエンドシステムが公開する統合インターフェースの複雑さを解消し、API クライアントが将来の変更にも柔軟に対応できるインターフェースを提供する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\nある組織では、すべての CloudHub デプロイメントに対して、ある 1 つの特定の CloudHub (AWS) リージョンを使用しています。\n\n\n組織の Mule アプリケーションがそのリージョンの CloudHub にデプロイされるとき、CloudHubワーカーはどのようにアベイラビリティゾーン (Availability Zone, AZ) に割り当てられますか?\n\n\n\n',
//         A: [
//             'CloudHubワーカーは、リージョン内の利用可能な AZ にランダムに分散される。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある E コマースの会社において、カタログに新製品が追加されたため、Order API へのリクエスト呼び出しが大幅に増加していることに気づきました。顧客はパフォーマンスの低下とタイムアウトエラーを頻繁に経験しており、そのため注文を完了することができません。この問題は、企業にとって損失となります。\n\n\n\nアプリケーションが CloudHub にデプロイされている場合、問題を解決する最もシンプルなソリューションは次のうちどれですか?',
//         A: [
//             '水平スケーリング (horizontal scaling) を適用する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Anypoint Platform の組織管理者 (organization administrator) は、シングルサインオン (SSO) のユーザーを設定するために、OpenID Connect に準拠したプロバイダーを使用して、外部 ID プロバイダー (external identity provider, IdP) を構成するよう求められています。\n\n\n\nユーザーがすでに Anypoint Platform 組織に存在し、SSO でログインするために使用されるユーザー名と同じユーザー名を持っている場合の適切な説明は次のうちどれですか?',
//         A: [
//             'SSO でログインするために使用される新しいユーザーは、同じユーザー名を持つ元のユーザーと共存することができる。同じユーザー名を持つユーザーは、互いに独立して管理される。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある企業は Runtime Manager を使用して、デフォルトの構成の Customer-hosted (顧客がホストする) Mule ランタイムに Mule アプリケーションをデプロイしています。各 Mule アプリケーションは、API クライアントに RESTful インターフェイスを公開する API 実装です。Mule ランタイムは、MuleSoft-hosted (MuleSoft がホストする) コントロールプレーンによって管理されています。\n\n\n\nAPI クライアントが Customer-hosted (顧客がホストする) Muleアプリケーションに HTTP リクエストを送信する時に、MuleSoft-hosted (MuleSoft がホストする) コントロールプレーンに送信される「データ (payload)」 と「メタデータ」に関する正しい説明は次のうちどれですか?',
//         A: [
//             'メタデータのみが、MuleSoft-hosted (MuleSoft がホストする) コントロールプレーンに送信される。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\n「Product (製品) API」を呼び出すなど、多くのインテグレーションロジックを含む「Order (注文) API」を設計する必要があります。\n\n\nOrder APIとProduct API 間の力関係は、顧客 / サプライヤー (customer/supplier) の関係です。(Product API は組織全体で多用されており、CTO オフィスにある専門の開発チームによって開発されているため)。\n\n\nOrder API 内で Product API のデータモデルを扱うために採用すべき戦略は次のうちどれですか?\n\n\n※ Order API: 注文 API\n※ Product API 製品 API\n※ Product Data: 製品データ\n※ invokes: 呼び出す\n\n\n\n',
//         A: [
//             'Product API のデータモデルを Order API の内部データ型に変換する不正防止レイヤー (anti-corruption layer) を Order API に実装する。\n\n\n※ ACL: anti-corruption layer \n\n\n'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\nある組織がスタンドアロン Mule ランタイムを実行しており、Anypoint Platform の外部 ID プロバイダ (identity provider, IdP) として Active Directory を構成しています。この組織には、他のシステムコンポーネントを使用するための予算がありません。 \n\n\n特定のグループの内部ユーザーのみにアクセスを許可するために、組織内の API のすべてのインスタンスに適用するべきポリシーは次のうちどれですか?\n\n\n\n\n\n',
//         A: [
//             'Basic Authentication  (ベーシック認証) - LDAP ポリシーを適用し、Active Directory をユーザー認証用の LDAP ソースとして設定する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'あるヘルスケア業界の顧客が VPC (Virtual Private Cloud) を構成してあり、API の数は 120 に近くなると想定しています。\n\n\n\n3つの非本番環境 (Dev, QA, UAT) でアプリケーションをデプロイするために、最小 CIDR ブロックは次のうちどれですか?',
//         A: [
//             '169.254.0.0/22'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Mule アプリケーションは 1 つの CloudHubワーカー／レプリカにデプロイされています。Mule アプリケーションは複数の API 実装の API クライアントとして動作し、各 API は API 呼び出しのたびに Mule アプリケーションからの一時的なアクセストークンを必要とします。\n\n\nこの頻繁に変更される一時的なアクセストークンを、Mule アプリケーションで使用するために保存するメカニズムが必要です。トークンの有効期限が切れて交換されるまでは、Mule アプリケーションのフロー呼び出しの度に同じアクセストークンを読み込む必要があります。\n\n\nこれらのアクセストークンを保存できる、すぐに利用可能な Anypoint コネクタおよび Anypoint Platform のデプロイオプションは次のうちどれですか?',
//         A: [
//             'Object Store コネクタを使用し、非永続的な (non-persistent) Object Store を構成した Mule アプリケーションをデプロイします。\n'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '以下を参照してください。\n\n\n\n多くの REST API を実装するある Mule アプリケーションが、組織外からアクセスできない独自のサブネット (private-subnet, プライベートサブネット) にデプロイされています。\n\n\n外部のビジネスパートナーは、これらの API にアクセスする必要がありますが、これらの API はパートナー専用の別のサブネット (partner-subnet, パートナーサブネット) からしか呼び出すことが許可されていません。このパートナーサブネットには Mule ランタイムがデプロイされており、パブリック (public) インターネットからアクセス可能です。\n\n\nこれらの要件に最も効果的に準拠し、現在 API を使用している他のアプリケーションへの影響が最も少ないソリューションは次のうちどれですか?\n\n\n※ Internal apps can access the private APIs: 内部アプリケーションは、プライベート API にアクセス可能\n※ Internal apps: 内部アプリケーション\n\n\n\n※ Private APIs: プライベート API\n\n※ Partner APIs: パートナー API\n\n\n\n※ private-subnet: プライベートサブネット\n※ partner-subnet: パートナーサブネット\n\n\n\n',
//         A: [
//             '各 API の API プロキシ Mule アプリケーションを実装 (または生成) し、その API プロキシをパートナーサブネット (partner-subnet) 内の Mule ランタイムにデプロイする。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'Order (注文) API を呼び出す、ある API 実装を設計しています。Order API は繰り返しダウンタイムが発生することで知られており、Order API が利用できない場合、代替 API が呼び出されることになっています。\n\n\n\nフォールバックAPIの呼び出しを設計するために、最良の弾力性 (レジリエンス) を提供するアプローチは次のうちどれですか?',
//         A: [
//             'Anypoint Exchange で適切な代替 API を検索し、Order API が利用できないときはこの代替 API への呼び出すよう実装する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '既存の「Orders API (注文 API)」は RAMLで定義されており、その RAML 仕様は API Manager で API 実装にポリシーを適用するために使用されています。API Manager を使用して、「Client ID Enforcement (クライアント ID 適用) ポリシーをサポートする」という新しい要件があります。\n\n\n\nこの新しいポリシーによって必要となる変更を REST クライアントに通知するために、RAML API 定義で更新するべき部分は次のうちどれですか？ ',
//         A: [
//             'RAML の「認証の ID (authentication identification) 」に関して記述する部分で、リクエストヘッダーを更新する必要がある。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'システム API (System API) のデータモデルが、対応するバックエンドシステムのデータモデルを合理的に模倣し、修正を最小限するべきケースは次のうちどれですか?\n',
//         A: [
//             'バックエンドシステムとの分離を限定したデータモデリングが適切と判断される場合'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある組織が CloudHub の複数のワーカー／レプリカに、OrderStatus System API (注文状況システム API) の新しい実装をデプロイしています。この API は、組織のオンプレミスで実行している受注管理システムの前面にあり、OrderStatus System API から受注管理システムには安全にアクセスすることができます。この API では、サーキットブレーカーリトライ機能が構築されています。\n\n\nどのタイプのエラー起きた場合、OrderStatus System API を手動で再起動する必要性がありますか?\n\n',
//         A: [
//             'CloudHubワーカー／レプリカがOut of Memory の例外で停止した場合'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: '複数の CloudHubワーカー／レプリカにデプロイされた Mule アプリケーションにおいて、非同期実行の長時間プロセスでトランザクションの状態を追跡するために、Anypoint Platform ですぐに利用可能な最もパフォーマンスの高いソリューションは次のうちどれですか?\n',
//         A: [
//             'Persistent object store (永続的オブジェクトストア)'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある API 実装がCloudHubにデプロイされます。\n\n\n\nデフォルトの Anypoint Platform 機能を使用して、API 実装へのリクエストの処理に関するアラートを、どのような条件でトリガーすることができますか？',
//         A: [
//             'API 呼び出しの応答時間がしきい値を超えた場合'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある企業では、ビルドとデプロイのプロセスを自動化するために、DevOps パイプラインの一部としてGitHub, Jenkins, Nexus をセットアップしています。開発者が特定のブランチにコードをチェックインした後、ビルドを行うために Jenkins パイプラインがトリガーされます。\n\n\nJenkins によってパッケージが正常に生成された後のステップは次のうちどれですか?',
//         A: [
//             '生成されたアーティファクト (成果物) を Nexus リポジトリにアップロードする。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'MuleSoft のベストプラクティスによると、組織ですぐに利用・再利用可能なインテグレーションとAPI を特定、設計、開発する責任を負うべきチームは次のうちどれですか?\n',
//         A: [
//             'Center for Enablement (C4E) チーム'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある大手医療機関では、数年前からアプリケーションネットワークを構築しており、各レイヤー (階層) に多数の API を保有しています。同社は、開発者が共通のビジネスオブジェクトを使用する際に効率化できる方法を探しています。\n\n\n\n多くの Web APIへの呼び出しを、単一のエンドポイントに簡素化することができる Anypoint コンポーネントは次のうちどれですか?',
//         A: [
//             'DataGraph'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     },
//     {
//         Q: 'ある組織では、外部の SaaS システムとレガシーなオンプレミスデータベースが混在しており、組織のパブリック向け (public-facing) ファイヤーウォールが構成されています。どの SaaS システムも AWS を使用していません。新しい Mule アプリケーションは、SaaS システムとオンプレミスのデータベースを統合するために設計されています。組織は、IT インフラストラクチャへの投資を最小限に抑えたいと考えています。\n\n\n\nMule アプリケーションのデプロイメントに使用されるべき Anypoint Platform ランタイムプレーンと、 要件をサポートする Anypoint Platform のネットワーク構成は次のうちどれですか?',
//         A: [
//             'MuleSoft-hosted (MuleSoft がホストする) ランタイムプレーンに、アプリケーションをデプロイする。\n\nオンプレミスネットワークへの IPSec トンネルを設定した Anypoint VPC でネットワークを構成する。'
//         ],
//         isGuess: false,
//         isFix: true,
//         Guess: []
//     }
// ];
// var nScoreOld = 60;

var arrList = [];
var nScoreOld = -1;

var timer = null;
var guessIndex = -1;
var isParsedScore = false;
var isFinish = false;
var isAllFinished = false;

function Main() {
    var divMain = document.getElementById('eb-cp-content');

    if (!divMain) {
        return;
    }

    // 蓝色的Next按钮如果存在，则优先点击Next按钮
    var btnBlueNext = divMain.getElementsByClassName('btn-primary');
    if (btnBlueNext.length > 0) {
        btnBlueNext[0].click();
        return;
    }

    // Quiz区域
    var divQuiz = document.getElementById('eb-cp-quiz-content');
    if (divQuiz && divQuiz.style.display != 'none') {
        CheckQuizStatus();
    }
}

function CheckQuizStatus() {
    // Start按钮如果存在，则按Start按钮
    var btnStart = document.getElementById('eb-cp-quiz-content.startButton');
    if (btnStart) {
        btnStart.click();
        return;
    }

    // 状态如果是INPROGRESS，则执行Quiz外挂
    var divBottomBar = document.getElementById('eb-cp-quiz-content.bottomBar');
    if (divBottomBar) {
        var cells = divBottomBar.getElementsByTagName('td');
        if (cells.length > 0) {
            if (GetElementText(cells[0]).indexOf('INPROGRESS') >= 0) {
                MakeAnswer();
                return;
            }
        }
    }

    // 出现结果画面，则解析结果
    var divResult = document.getElementById('eb-cp-quiz-content.result.content');
    if (divResult) {
        ParseScore();
        return;
    }
}

function MakeAnswer() {
    var objQuestion = document.getElementsByClassName('questionText');
    // 找不到题目
    if (objQuestion.length == 0) {
        return;
    }

    isParsedScore = false;
    var strQuestion = GetElementText(objQuestion[0]);
    var isFoundQuestion = false;
    var isSetAnswer = false;
    var node = null;
    var index = -1;
    for (var i = 0; i < arrList.length; i++) {
        node = arrList[i];
        // 找到题目
        if (strQuestion.indexOf(node.Q) >= 0) {
            isFoundQuestion = true;
            index = i;
            UpdateQuestion(node, strQuestion);
            if (!node.isFix && guessIndex == -1) {
                node.isGuess = true;
                guessIndex = i;
            }
            isSetAnswer = SetAnswer(node);
            break;
        }
    }

    // 未找到题目
    if (!isFoundQuestion) {
        node = new Object();
        node.Q = new String();
        node.A = new Array();
        node.Guess = new Array();

        UpdateQuestion(node, strQuestion);
        if (!node.isFix && guessIndex == -1) {
            node.isGuess = true;
            guessIndex = i;
        }
        arrList.push(node);
        index = arrList.length - 1;
    }

    // 未找到答案
    if (!isSetAnswer) {
        SetNewAnswer(node);
    }


    var objNext = document.getElementById('eb-cp-quiz-content.btnNext');
    if (objNext.style.display == 'none') {
        var objFinish = document.getElementById('ebTakeTestFinish');
        if (!isFinish && !isAllFinished) {
            objFinish.click();
            isFinish = true;
        }
    } else {
        objNext.click();
    }

}


function ParseScore() {
    var nScoreNew = GetResult();
    if (nScoreNew < 0) {
        // 尚未开始考试
        RestartTest();
        return;
    }

    // 已经解析过结果，不需要重复操作
    if (isParsedScore) {
        // 继续考试
        RestartTest()
        return;
    }

    var isAllFixed = true;
    for (let index = 0; index < arrList.length; index++) {
        const node = arrList[index];
        if (!node.isFix) {
            isAllFixed = false;
            break;
        }
    }
    if (isAllFixed) {
        nScoreOld = nScoreNew;
        // 输出结果
        SetResult();
        isAllFinished = true;
        clearInterval(timer);
        return;
    }

    // 全新创建的场合
    if (nScoreOld == -1) {
        console.log('全新创建');
        nScoreOld = nScoreNew;
    }
    else if (nScoreNew == (nScoreOld + 1)) {
        console.log('猜测正确');
        var node = arrList[guessIndex];
        node.A = [];
        node.A.push(node.Guess.pop());
        node.isGuess = false;
        node.isFix = true;
        guessIndex = -1;
        nScoreOld = nScoreNew;
    } else if (nScoreNew == (nScoreOld - 1)) {
        console.log('原答案正确');
        var node = arrList[guessIndex];
        node.Guess = [];
        node.isGuess = false;
        node.isFix = true;
        guessIndex = -1;
    } else if (nScoreNew == nScoreOld) {
        console.log('原答案错误，猜测错误');
    } else {
        var node = arrList[guessIndex];
        node.Guess = [];
        node.isGuess = false;
        node.isFix = false;
        guessIndex = -1;
        console.error('发生错误。前回正确个数：' + nScoreOld + ' 今回正确个数：' + nScoreNew);
        nScoreOld = nScoreNew;
    }

    isParsedScore = true;

    // 输出结果
    SetResult();

    // 继续考试
    RestartTest();
}

function RestartTest() {
    isFinish = false;
    var objRestart = document.getElementsByClassName('button grey_button small_button btn btn-default btn-light');
    if (objRestart && objRestart.length > 0) {
        objRestart[0].click();
    } else {
        var objA = document.getElementsByClassName('jstree-clicked');
        if (objA.length > 0) {
            objA[0].click();
        }
    }
}


function SetResult() {
    var result = '';
    result += "var arrList = [\n";
    var arrQA = [];

    for (let i = 0; i < arrList.length; i++) {
        var strQA = "";

        const node = arrList[i];

        strQA += "    {\n";
        strQA += "        Q: '" + node.Q.replaceAll("\\", "\\\\").replaceAll("\r", "\\r").replaceAll("\n", "\\n").replaceAll("'", "\\'") + "',\n";
        strQA += "        A: [\n";
        strQA += GetAnswerArray(node) + "\n";
        strQA += "        ],\n"
        strQA += "        isGuess: false,\n";
        strQA += "        isFix: " + node.isFix + ",\n";
        strQA += "        Guess: []\n";
        strQA += "    }";

        arrQA.push(strQA);

    }

    result += arrQA.join(",\n") + "\n";
    result += "];\n"
    result += "var nScoreOld = " + nScoreOld + ";\n";
    console.log(result);
}

function GetAnswerArray(node) {
    var arrAnswer = [];
    for (let j = 0; j < node.A.length; j++) {
        var strAnswer = "            '" + node.A[j].replaceAll("\\", "\\\\").replaceAll("\r", "\\r").replaceAll("\n", "\\n").replaceAll("'", "\\'") + "'";
        arrAnswer.push(strAnswer);
    }

    return arrAnswer.join(",\n");
}

function SetAnswer(node) {
    var objAnswer = null;
    var blRet = false;
    if (node.isGuess) {
        objAnswer = GetGuess(node);
        if (objAnswer) {
            console.log('Q:' + node.Q + '\nGuess:' + GetElementText(objAnswer) + '\n');
            node.Guess.push(GetElementText(objAnswer.getElementsByClassName('choiceText')[0]));
            objAnswer.click();
            blRet = true;
        }
    } else {
        for (let index = 0; index < node.A.length; index++) {
            objAnswer = GetAnswer(node, index);
            if (objAnswer) {
                // console.log('Q:' + node.Q + '\nClick:' + GetElementText(objAnswer) + '\n');
                objAnswer.click();
                blRet = true;
            }
        }
    }

    return blRet;
}

function SetNewAnswer(node) {
    node.A.push('');
    var answerIndex = node.A.length - 1;

    var arrAnswer = document.getElementsByClassName('clickableRow');
    if (arrAnswer.length == 0) {
        console.error('选项没找到。');
        return;
    }

    const objAnswer = arrAnswer[0];
    UpdateAnswer(node, answerIndex, objAnswer);
    objAnswer.click();
}

function GetAnswer(node, answerIndex) {
    var arrAnswer = document.getElementsByClassName('clickableRow');
    var objRet = null;
    var strAnswerNode = node.A[answerIndex];

    for (let index = 0; index < arrAnswer.length; index++) {
        const objAnswer = arrAnswer[index];
        var strAnswer = GetElementText(objAnswer.getElementsByClassName('choiceText')[0]);

        var objInput = objAnswer.getElementsByTagName('input')[0];
        // 单项选择的场合，必须完全匹配
        if (objInput.type == 'radio') {
            if (strAnswer == strAnswerNode) {
                objRet = objAnswer;
                UpdateAnswer(node, answerIndex, objAnswer);
                return objRet;
            }
            // 多项选择的场合，可以部分匹配（由用户负责不会重复）
        } else {
            // 强制设置成确定状态，不猜测
            node.isFix = true;
            if (strAnswer.indexOf(strAnswerNode) >= 0) {
                objRet = objAnswer;
                UpdateAnswer(node, answerIndex, objAnswer);
                return objRet;
            }
        }
    }

    return objRet;
}

function UpdateQuestion(node, strQuestion) {
    node.Q = strQuestion;
}

function UpdateAnswer(node, index, objAnswer) {
    node.A[index] = GetElementText(objAnswer.getElementsByClassName('choiceText')[0]);
}

function GetGuess(node) {
    var arrAnswer = document.getElementsByClassName('clickableRow');
    var objRet = null;
    var isAnswer = false;
    var isGuess = false;
    var isRadio = false;

    for (let index = 0; index < arrAnswer.length; index++) {
        const objAnswer = arrAnswer[index];

        isAnswer = false;
        isGuess = false;

        var strAnswer = GetElementText(objAnswer.getElementsByClassName('choiceText')[0]);

        var objInput = objAnswer.getElementsByTagName('input')[0];
        if (objInput.type != 'radio') {
            // 强制设置成确定状态，不猜测
            node.isFix = true;
            node.isGuess = false;
            isRadio = fasle;
        } else {
            isRadio = true;
        }

        for (let i = 0; i < node.A.length; i++) {
            const strAnswerSub = node.A[i];
            // 单项选择的场合，必须完全匹配
            if (isRadio) {
                if (strAnswer == strAnswerSub) {
                    isAnswer = true;
                    break;
                }
            } else {
                if (strAnswer.indexOf(strAnswerSub) >= 0) {
                    isAnswer = true;
                    break;
                }
            }
        }

        for (let i = 0; i < node.Guess.length; i++) {
            const strGuess = node.Guess[i];
            // 单项选择的场合，必须完全匹配
            if (isRadio) {
                if (strAnswer == strGuess) {
                    isGuess = true;
                    break;
                }
            } else {
                // 多选的场合，不猜测
                // if (strAnswer.indexOf(strGuess) >= 0) {
                //     isGuess = true;
                //     break;
                // }
            }
        }

        if (!isAnswer && !isGuess) {
            objRet = objAnswer;
            break;
        }
    }

    return objRet;
}

function GetResult() {
    var nScore = -1;
    var objDivResult = document.getElementById('eb-cp-quiz-content.topBar');
    if (objDivResult) {
        var objDivScore = objDivResult.getElementsByClassName('test-result-score-block');
        if (objDivScore.length > 0) {
            var strScore = GetElementText(objDivScore[0].getElementsByClassName('small')[0]);
            nScore = parseInt(strScore);
        }
    }

    return nScore;
}

function GetElementText(element) {
    var strText = element.innerText;
    if (strText.trim() == '') {
        strText = element.innerHTML;
    }
    return strText;
}

var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode("function confirm(){return 1;}function alert(msg){console.log(msg);return 1;}"));
document.body.appendChild(script);

timer = setInterval(Main, 1000);
