// ==UserScript==
// @name         Map terms Azure to AWS
// @namespace    http://tampermonkey.net/
// @version      0.304
// @description  Display the corresponding AWS-related term near the Azure-related term on the Microsoft documentation site.
// @author       uemuram
// @match        https://docs.microsoft.com/*
// @match        https://qiita.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399618/Map%20terms%20Azure%20to%20AWS.user.js
// @updateURL https://update.greasyfork.org/scripts/399618/Map%20terms%20Azure%20to%20AWS.meta.js
// ==/UserScript==

(function main(w) {
  'use strict';

  // マッピング
  const termMappings = [
    { 'azure': 'Application Insights', 'aws': 'CloudWatch' },
    { 'azure': 'Cost Management', 'aws': 'Cost Explorer' },
    { 'azure': 'File Sync', 'aws': 'DataSync' },
    { 'azure': 'Azure Marketplace', 'aws': 'AWS Marketplace' },
    { 'azure': 'CycleCloud', 'aws': 'Parallel Cluster' },
    { 'azure': 'Machine Learning', 'aws': 'SageMaker' },
    { 'azure': 'Machine Learning Studio', 'aws': 'SageMaker' },
    { 'azure': 'Bot Framework', 'aws': 'Alexa Skills Kit' },
    { 'azure': 'Speech Services', 'aws': 'Amazon Lex' },
    { 'azure': 'Language Understanding', 'aws': 'Amazon Lex' },
    { 'azure': 'Speech Services', 'aws': 'Amazon Polly、Amazon Transcribe' },
    { 'azure': 'Cognitive Services', 'aws': 'Amazon Rekognition' },
    { 'azure': 'Cognitive Search', 'aws': 'CloudSearch' },
    { 'azure': 'Azure 仮想アシスタント', 'aws': 'Alexa Skills Kit' },
    { 'azure': '仮想アシスタント', 'aws': 'Alexa Skills Kit' },
    { 'azure': 'Synapse Analytics', 'aws': 'Redshift' },
    { 'azure': 'Databricks', 'aws': 'EMR' },
    { 'azure': 'HDInsight', 'aws': 'EMR' },
    { 'azure': 'Data Lake Storage', 'aws': 'EMR' },
    { 'azure': 'Data Factory', 'aws': 'データ パイプライン、AWS Glue' },
    { 'azure': 'Data Catalog', 'aws': 'AWS Glue' },
    { 'azure': 'Stream Analytics', 'aws': 'Kinesis Analytics' },
    { 'azure': 'Data Lake Analytics', 'aws': 'Kinesis Analytics' },
    { 'azure': 'Data Lake Store', 'aws': 'Kinesis Analytics' },
    { 'azure': 'Data Share', 'aws': 'Lake Formation' },
    { 'azure': 'Power BI', 'aws': 'QuickSight' },
    { 'azure': 'Azure Search', 'aws': 'CloudSearch' },
    { 'azure': 'Azure Data Lake Analytics', 'aws': 'Amazon Athena' },
    { 'azure': 'Virtual Machine Scale Sets', 'aws': 'AWS Auto Scaling' },
    { 'azure': 'Virtual Machines', 'aws': 'Elastic Compute Cloud (EC2) インスタンス' },
    { 'azure': 'Azure Batch', 'aws': 'AWS Batch' },
    { 'azure': 'VMware by CloudSimple', 'aws': 'VMware Cloud on AWS' },
    { 'azure': 'Container Instances', 'aws': 'Elastic Container Service (ECS)' },
    { 'azure': 'Container Registry', 'aws': 'Elastic Container Registry' },
    { 'azure': 'Kubernetes Service', 'aws': 'Elastic Kubernetes Service (EKS)' },
    { 'azure': 'Service Fabric Mesh', 'aws': 'App Mesh' },
    { 'azure': 'Azure Functions', 'aws': 'Lambda' },
    { 'azure': 'SQL Database', 'aws': 'RDS' },
    { 'azure': 'Database for MySQL', 'aws': 'RDS' },
    { 'azure': 'Database for PostgreSQL', 'aws': 'RDS' },
    { 'azure': 'Cosmos DB', 'aws': 'DynamoDB、SimpleDB、Amazon DocumentDB' },
    { 'azure': 'CosmosDB', 'aws': 'DynamoDB、SimpleDB、Amazon DocumentDB' },
    { 'azure': 'Table Storage', 'aws': 'DynamoDB' },
    { 'azure': 'Cache for Redis', 'aws': 'ElastiCache' },
    { 'azure': 'Database Migration Service', 'aws': 'AWS Database Migration Service' },
    { 'azure': 'Azure Monitor', 'aws': 'CloudWatch、AWS X-Ray' },
    { 'azure': 'DevOps', 'aws': 'CodeDeploy、CodeCommit、CodePipeline' },
    { 'azure': '開発者ツール', 'aws': 'AWS 開発者ツール' },
    { 'azure': 'DevOps', 'aws': 'AWS CodeBuild' },
    { 'azure': 'CLI', 'aws': 'コマンド ライン インターフェイス' },
    { 'azure': 'PowerShell', 'aws': 'コマンド ライン インターフェイス' },
    { 'azure': 'Automation', 'aws': 'OpsWorks (Chef ベース)' },
    { 'azure': 'Resource Manager', 'aws': 'CloudFormation' },
    { 'azure': 'VM 拡張機能', 'aws': 'CloudFormation' },
    { 'azure': 'Azure Automation', 'aws': 'CloudFormation' },
    { 'azure': 'IoT Hub', 'aws': 'AWS IoT' },
    { 'azure': 'IoT Edge', 'aws': 'AWS Greengrass' },
    { 'azure': 'Event Hubs', 'aws': 'Kinesis Firehose、Kinesis Streams' },
    { 'azure': 'Digital Twins', 'aws': 'AWS IoT Things Graph' },
    { 'azure': 'Azure Advisor', 'aws': 'Trusted Advisor' },
    { 'azure': 'Billing API', 'aws': 'AWS Usage and Billing Report' },
    { 'azure': 'Azure Portal', 'aws': 'AWS Management Console' },
    { 'azure': 'Azure Migrate', 'aws': 'AWS Application Discovery Service' },
    { 'azure': 'Azure Monitor', 'aws': 'Amazon EC2 Systems Manager' },
    { 'azure': 'Resource Health', 'aws': 'AWS Personal Health Dashboard' },
    { 'azure': 'Queue Storage', 'aws': 'Simple Queue Service (SQS)' },
    { 'azure': 'Service Bus', 'aws': 'Simple Queue Service (SQS)' },
    { 'azure': 'Event Grid', 'aws': 'Simple Notification Service' },
    { 'azure': 'App Center', 'aws': 'Mobile Hub、Mobile SDK、Cognito、AWS Device Farm、Mobile Analytics' },
    { 'azure': 'Xamarin アプリ', 'aws': 'Mobile Hub' },
    { 'azure': 'Virtual Network', 'aws': 'Virtual Private Cloud (VPC)' },
    { 'azure': '仮想ネットワーク', 'aws': 'Virtual Private Cloud (VPC)' },
    { 'azure': 'VPN Gateway', 'aws': 'AWS VPN Gateway' },
    { 'azure': 'DNS', 'aws': 'Route 53' },
    { 'azure': 'Traffic Manager', 'aws': 'Route 53' },
    { 'azure': 'ExpressRoute', 'aws': 'Direct Connect' },
    { 'azure': 'Load Balancer', 'aws': 'Network Load Balancer' },
    { 'azure': 'Application Gateway', 'aws': 'Application Load Balancer' },
    { 'azure': 'PrivateLink', 'aws': 'ネットワークの分離' },
    { 'azure': 'Azure Active Directory', 'aws': 'Identity and Access Management (IAM)' },
    { 'azure': 'ロール ベースのアクセス制御', 'aws': 'Identity and Access Management (IAM)' },
    { 'azure': 'サブスクリプション管理 + Azure RBAC', 'aws': 'AWS Organizations' },
    { 'azure': 'Multi-Factor Authentication', 'aws': 'Multi-Factor Authentication' },
    { 'azure': 'Azure Active Directory Domain Services', 'aws': 'AWS Directory Service' },
    { 'azure': 'Azure Active Directory B2C', 'aws': 'Cognito' },
    { 'azure': 'Azure Policy', 'aws': 'AWS Organizations' },
    { 'azure': '管理グループ', 'aws': 'AWS Organizations' },
    { 'azure': 'Azure Storage Service Encryption', 'aws': 'Amazon S3 Key Management Service を使用したサーバー側の暗号化' },
    { 'azure': 'Key Vault', 'aws': 'キー管理サービス (KMS)、CloudHSM' },
    { 'azure': 'Application Gateway - Web アプリケーション ファイアウォール', 'aws': 'Web アプリケーション ファイアウォール' },
    { 'azure': 'Azure Firewall', 'aws': 'Web アプリケーション ファイアウォール' },
    { 'azure': 'セキュリティ センター', 'aws': 'Inspector' },
    { 'azure': 'ポータルで使用可能な App Service 証明書', 'aws': 'Certificate Manager' },
    { 'azure': 'Advanced Threat Protection', 'aws': 'GuardDuty' },
    { 'azure': 'Service Trust Portal', 'aws': 'AWS Artifact' },
    { 'azure': 'DDoS Protection サービス', 'aws': 'AWS Shield' },
    { 'azure': 'BLOB Storage', 'aws': 'Simple Storage Services (S3)' },
    { 'azure': 'マネージド ディスク', 'aws': 'Elastic Block Store (EBS)' },
    { 'azure': 'Azure Files', 'aws': 'Elastic File System' },
    { 'azure': 'Storage クール層', 'aws': 'S3 Infrequent Access (IA)' },
    { 'azure': 'Storage アーカイブ アクセス層', 'aws': 'S3 Glacier' },
    { 'azure': 'Azure Backup', 'aws': 'AWS Backup' },
    { 'azure': 'StorSimple', 'aws': 'Storage Gateway' },
    { 'azure': 'Import/Export', 'aws': 'AWS Import/Export ディスク' },
    { 'azure': 'Data Box', 'aws': 'AWS Import/Export Snowball、Snowball Edge、Snowmobile' },
    { 'azure': 'App Service', 'aws': 'Elastic Beanstalk' },
    { 'azure': 'API Management', 'aws': 'API Gateway' },
    { 'azure': 'Content Delivery Network', 'aws': 'CloudFront' },
    { 'azure': 'Front Door', 'aws': 'Global Accelerator' },
    { 'azure': 'Logic Apps', 'aws': 'AWS Step Functions' },
    { 'azure': 'Office 365', 'aws': 'Amazon WorkMail、Amazon WorkDocs' },
    { 'azure': 'PlayFab', 'aws': 'GameLift、GameSparks' },
    { 'azure': 'Media Services', 'aws': 'Elastic Transcoder' },
    { 'azure': 'Logic Apps', 'aws': 'Simple Workflow Service (SWF)' },
    { 'azure': 'Azure Stack', 'aws': 'Outposts' },
    { 'azure': 'Azure DDoS Protection', 'aws': 'AWS Shield' },
    { 'azure': 'Network Watcher', 'aws': 'AWS Transit Gateway Network Manager' },
    { 'azure': 'Notification Hubs', 'aws': 'Amazon Pinpoint' },
  ]

  // ヒットした部分を加工する
  let replaceTermString = function (str) {
    for (let i = 0; i < termMappings.length; i++) {
      let index = str.toLowerCase().indexOf(termMappings[i].azure.toLowerCase());
      if (index >= 0) {
        let beforeStr = str.substring(0, index);
        let targetTerm = str.substring(index, index + termMappings[i].azure.length);
        let afterStr = str.substring(index + termMappings[i].azure.length);
        return replaceTermString(beforeStr)
          + '<div class="tooltip">' + targetTerm + "<span>" + termMappings[i].aws + '</span></div>'
          + replaceTermString(afterStr);
      }
    }
    return str;
  }

  // 子要素を走査し、テキストノード(nodeType=3)であれば、書き換えを行う
  let replaceTerm = function (r) {
    let children = r.childNodes;
    let l = children.length;
    for (let i = 0; i < l; i++) {
      let child = (children[i]);
      if (child.nodeType == 3 && !/^[ \n\t]+$/.test(child.nodeValue) && child.nodeValue.length > 0) {
        let newStr = replaceTermString(child.nodeValue);
        // 書き換えが発生した場合はDOMを変更
        if (newStr !== child.nodeValue) {
          let newSpan = document.createElement("span");
          newSpan.innerHTML = newStr;
          r.insertBefore(newSpan, child);
          child.remove();
        }
      } else {
        replaceTerm(child);
      }
    }
  }

  // スタイル追加
  let style = document.createElement("style");
  document.head.appendChild(style);
  let sheet = style.sheet;
  sheet.insertRule("div.tooltip {display:inline; border-bottom:solid 1px #87CEFA}", 0);
  sheet.insertRule("div.tooltip span {display:none; padding:5px; margin:10px 0 0 0px;}", 1);
  sheet.insertRule("div.tooltip:hover span {display:inline;  position:absolute; border:1px solid #CCC; border-radius:5px; background:#F7F7F7; color:#666; font-size:12px; line-height:1.6em;}", 2);

  var o, i;
  //フレームが複数ある場合を考慮してmainを再帰的に実行
  while (o = w.frames[i++]) try { main(o) } catch (o) { }
  replaceTerm(w.document.body);
})(window);